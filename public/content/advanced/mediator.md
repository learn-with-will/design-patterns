---
id: lesson-18
slug: mediator
title: "Mediator"
level: advanced
order: 18
duration: 15
tags:
  - behavioral
  - mediator
  - coupling
  - communication
  - gof
summary: "The Mediator pattern — route communication between many objects through a single mediator instead of letting them reference each other directly, cutting a tangle of many-to-many links down to simple spokes around one hub."
---

# Learning Objectives

By the end of this lesson you will be able to:

- State the **intent** of the Mediator pattern.
- Explain how it reduces **many-to-many** coupling to a hub-and-spoke shape.
- Implement a mediator in TypeScript where colleagues talk through it.
- Distinguish Mediator from Observer and Facade.

# Why It Matters

When many objects need to coordinate — form fields that enable/disable each other, chat participants,
air-traffic controllers — letting each hold references to all the others creates a **web** of
connections that's brittle and hard to change. **Mediator** puts a single object in the middle: each
colleague talks only to the mediator, and the mediator coordinates everyone. The tangle becomes spokes
around a hub.

# Concept Explanation

### Intent

> **Define an object that encapsulates how a set of objects interact. Mediator promotes loose coupling
> by keeping objects from referring to each other explicitly, and it lets you vary their interaction
> independently.** — Gang of Four

### From a web to a hub

Without a mediator, *n* colleagues that all talk to each other tend toward *n×(n−1)* direct links — a
web that grows fast. With a mediator, each colleague has **one** link (to the mediator), and the
interaction logic lives in that one place:

```text
   web (no mediator)          hub (mediator)
   A —— B                        A
   |  ×  |                       │
   C —— D                    B — M — C
                                 │
                                 D
```

### In TypeScript

```typescript
interface ChatMediator {
  broadcast(from: string, message: string): void;
  register(user: User): void;
}

class ChatRoom implements ChatMediator {
  private users = new Map<string, User>();
  register(user: User) { this.users.set(user.name, user); user.room = this; }
  broadcast(from: string, message: string) {
    for (const [name, user] of this.users) {
      if (name !== from) user.receive(from, message); // mediator coordinates delivery
    }
  }
}

class User {
  room?: ChatMediator;
  constructor(public name: string) {}
  send(message: string) { this.room?.broadcast(this.name, message); }
  receive(from: string, message: string) { console.log(`${this.name} got "${message}" from ${from}`); }
}

const room = new ChatRoom();
const ada = new User("Ada"); const bob = new User("Bob");
room.register(ada); room.register(bob);
ada.send("hi"); // Bob receives it — Ada never referenced Bob
```

`User`s don't know about each other. They know the mediator; the mediator knows how to coordinate them.

### Mediator vs Observer vs Facade

- **Observer** is **one-to-many** broadcast: a subject notifies subscribers who *registered interest*.
  **Mediator** coordinates **many-to-many** interaction and often contains real interaction *logic*
  (who talks to whom, when).
- **Facade** offers a **one-way, simplified** entry point to a subsystem; it doesn't add two-way
  coordination between the subsystem's parts. Mediator's colleagues actively communicate **through** it.

### Consequences

- **Good:** colleagues are decoupled from each other; interaction logic is centralized and reusable;
  you can change how objects collaborate by editing one class.
- **Cost:** the mediator can become a **god object** as it absorbs all the coordination logic — the
  complexity is centralized, not eliminated.

# Key Terminology

- **Mediator** — the object that encapsulates interaction between colleagues.
- **Colleague** — an object that communicates only through the mediator.
- **Hub-and-spoke** — the shape Mediator creates: one center, many single links.
- **God object** — the risk if the mediator grows too large.

# Options and Trade-offs

| Concern | Mediator | Direct references | How to choose |
| ------- | -------- | ----------------- | ------------- |
| Coupling | Each colleague knows only the mediator | Everyone knows everyone | Mediator when many objects interact. |
| Interaction logic | Centralized in one place | Scattered across objects | Mediator to make coordination changeable. |
| Risk | Mediator may bloat | Web becomes unmanageable | Split a growing mediator by concern. |

# Worked Example

UI controls coordinate through a dialog mediator instead of each other:

```typescript
class Dialog {
  private agreed = false;
  toggleAgree(value: boolean) { this.agreed = value; this.refresh(); }
  private refresh() {
    // The mediator decides how controls relate: enable "OK" only when agreed.
    console.log(this.agreed ? "OK enabled" : "OK disabled");
  }
}
```

The checkbox tells the `Dialog`; the `Dialog` decides what the button does. The checkbox and button
never reference each other.

# Real World Analogy

A Mediator is an **air-traffic controller**. Pilots don't negotiate directly with every other plane —
that would be chaos. Each pilot talks only to the tower, and the tower coordinates who lands when. One
hub replaces a dangerous web of plane-to-plane deals.

# Examples

## Example 1 — Basic: chat without cross-references

`ada.send("hi")` reaches Bob because the `ChatRoom` delivers it. Ada holds no reference to Bob — only to
the room.

**Why this works:** all coordination flows through the mediator, so colleagues stay decoupled.

## Example 2 — Real-world: complex forms and UIs

A dialog with interdependent fields (selecting "other" reveals a text box; agreeing enables submit) is a
classic Mediator: each control reports to the mediator, which encodes the rules.

**Why this works:** the messy "when X then Y" logic lives in one object you can read and change.

## Example 3 — Pitfall: the mediator becomes a god object

If every rule, for every control, piles into one mediator, it swells into an unreadable class that
knows about everything.

**Why this bites:** Mediator centralizes complexity; left unchecked, the hub itself becomes the
maintenance problem.

# Common Mistakes

- **Confusing Mediator with Observer.** Observer is one-to-many notification; Mediator is many-to-many
  coordination with logic.
- **Letting the mediator grow unbounded** into a god object.
- **Using a mediator for two objects** that could just talk directly.

# Best Practices

- Route colleague communication **through** the mediator; keep colleagues ignorant of each other.
- Split a large mediator by **concern** before it becomes a god object.
- Reserve it for genuinely **many-to-many** interactions.

# Summary

- **Mediator** centralizes interaction between many objects so they don't reference each other
  directly.
- It turns a **web** of connections into a **hub-and-spoke**, decoupling colleagues.
- It differs from **Observer** (one-to-many notification) and **Facade** (one-way simplification).
- The main risk is the mediator growing into a **god object**.

# Flash Cards

Q: What is the intent of the Mediator pattern?
A: Define an object that encapsulates how a set of objects interact, promoting loose coupling by keeping them from referring to each other explicitly.

Q: How does Mediator change the shape of object communication?
A: It replaces a web of many-to-many direct references with a hub-and-spoke: each colleague talks only to the mediator.

Q: How does Mediator differ from Observer?
A: Observer is one-to-many notification to subscribers who registered interest; Mediator coordinates many-to-many interaction and often holds the interaction logic itself.

Q: How does Mediator differ from Facade?
A: Facade is a one-way simplified entry point to a subsystem; Mediator enables two-way coordination among colleagues that communicate through it.

Q: What is the main risk of the Mediator pattern?
A: The mediator can become a god object that absorbs all coordination logic, centralizing rather than eliminating complexity.

Q: In the chat example, why don't the users reference each other?
A: They only know the mediator (the chat room); it handles delivery, so colleagues stay decoupled from one another.

# Exercises

### Easy
Explain how `ada.send("hi")` reaches Bob without Ada holding a reference to Bob.

### Medium
Extend `ChatRoom` with a private message: `sendTo(from, to, message)` that delivers to a single user.
Note that users still only talk to the mediator.

### Challenging
Model a simple form where checking "ship to different address" enables a set of address fields, and
submit is disabled until required fields are filled. Put the rules in a mediator and explain how you'd
prevent it from becoming a god object.

# Further Reading

- Gamma et al. — *Design Patterns*, "Mediator".
- Refactoring.Guru — *Mediator*: <https://refactoring.guru/design-patterns/mediator>
- Refactoring.Guru — *Mediator in TypeScript*: <https://refactoring.guru/design-patterns/mediator/typescript/example>
