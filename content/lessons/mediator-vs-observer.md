---
slug: mediator-vs-observer
title: "Mediator vs Observer"
topic: behavioral-coordination
kind: concept
summary: "Mediator centralizes complex multidirectional interactions; Observer distributes one-to-many event notifications."
tags:
  - behavioral
  - mediator
  - observer
  - comparison
related:
  - mediator-intent
  - observer-intent
  - facade-vs-adapter-vs-mediator
---

> **In one line:** Mediator centralizes multidirectional peer coordination; Observer broadcasts unidirectional one-to-many event updates.

## The idea

Mediator and Observer both address communication between objects, and they are frequently used together. However, their architectural intents, coupling patterns, and communication topologies are completely different.

**Observer** establishes a **unidirectional one-to-many broadcast**. A Subject has no knowledge of who its observers are; when its state changes, it blindly sends notifications to all subscribed observers. The flow is strictly one-way: Publisher ➔ Multiple Subscribers. Observers react independently without coordinating with one another.

**Mediator** encapsulates **multidirectional coordination between peers**. Colleague objects talk to the Mediator, and the Mediator talks back to other Colleagues. Communication flows in multiple directions through a central hub to execute coordinated workflows, enforcing mutual validation rules across interacting peers.

| Dimension | Observer Pattern | Mediator Pattern |
|---|---|---|
| **Topology** | Distributed (one-to-many) | Centralized hub-and-spoke (many-to-many) |
| **Direction** | Strictly unidirectional (Subject ➔ Observers) | Multidirectional (Colleagues 🠄➔ Mediator) |
| **Coupling** | Subject is completely oblivious of observers | Mediator contains explicit coordination logic |
| **Primary Goal** | React to state changes asynchronously | Orchestrate complex multi-component workflows |

> **Note:** You can use Observer *inside* a Mediator: colleagues can act as Publishers that the Mediator subscribes to, eliminating the need for a dedicated `notify()` method.

## See it

```typescript
// Observer: Pure one-to-many notification
class StockTicker {
  private observers: Array<(price: number) => void> = [];
  subscribe(fn: (p: number) => void) { this.observers.push(fn); }
  update(price: number) { this.observers.forEach(fn => fn(price)); }
}

// Mediator: Centralized multidirectional coordination
class ChatRoomMediator {
  private users: Array<{ name: string; receive: (msg: string) => void }> = [];
  sendMessage(senderName: string, message: string) {
    for (const u of this.users) {
      if (u.name !== senderName) u.receive(`[${senderName}]: ${message}`);
    }
  }
}
```

## Go deeper

The difference can be summarized by asking: "Is the goal to notify whoever happens to be listening (Observer), or is the goal to coordinate a specific group of collaborating objects to accomplish a shared task (Mediator)?" If the logic requires complex conditional reactions between specific participants, use Mediator. When merely broadcasting state deltas to arbitrary unknown listeners, use Observer.

## Watch out

- Do not use Mediator if simple event subscriptions (Observer) are sufficient for notification.
- Avoid over-complicating Observer subjects with cross-subscriber coordination logic; that belongs in a Mediator.

## Remember

- Observer provides a decoupled, unidirectional one-to-many broadcast notification.
- Mediator provides a centralized, multidirectional coordination hub for interacting peers.
- Observer and Mediator can be combined by having the mediator subscribe to colleague events.
