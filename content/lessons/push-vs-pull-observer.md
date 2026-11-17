---
slug: push-vs-pull-observer
title: "Push vs Pull Information Models"
topic: behavioral-coordination
kind: concept
summary: "Push sends modified state details inside the notification; pull sends only an alert and lets observers query details."
tags:
  - behavioral
  - observer
  - push-model
  - pull-model
related:
  - observer-intent
  - subject-observer-subscription
  - observer-memory-leaks-and-cleanup
---

> **In one line:** Push broadcasts state data directly inside notifications; pull alerts observers and lets them query what they need.

## The idea

When a Subject notifies its Observers, how much information should be included in the notification payload? The Gang of Four catalog identifies two contrasting communication models: the **Push Model** and the **Pull Model**.

In the **Push Model**, the Subject bundles detailed state data into the notification argument: `observer.update(newTemperature, newHumidity, newWindSpeed)`. Observers receive the data immediately without needing to call back to the subject.

In the **Pull Model**, the Subject passes minimal information—often just a reference to itself or a generic notification signal: `observer.update(this)`. Each observer then queries (pulls) only the specific properties it cares about from the Subject's public API.

| Feature | Push Model | Pull Model |
|---|---|---|
| **Payload** | Heavy: detailed state bundled into call | Lightweight: minimal alert or subject reference |
| **Coupling** | Observers coupled to the event argument format | Observers coupled to the Subject's public getter methods |
| **Flexibility** | Less flexible: Subject guesses what observers need | Highly flexible: each observer queries different data |
| **Performance** | Can send unnecessary data across threads | May trigger multiple round-trip getter invocations |

> **Tip:** The Push model is preferred when data is small and uniform (e.g., standard mouse coordinates). The Pull model is preferred when different observers need radically different subsets of complex state.

## See it

```typescript
// Push Model: Subject sends data directly
interface PushObserver { update(price: number): void; }

// Pull Model: Subject passes self reference
interface PullObserver { update(subject: WeatherStation): void; }

class WeatherStation {
  public temperature = 25;
  private observers: PullObserver[] = [];

  attach(o: PullObserver) { this.observers.push(o); }
  notify() {
    for (const o of this.observers) o.update(this);
  }
}

class TemperatureDisplay implements PullObserver {
  update(ws: WeatherStation) {
    console.log(`Pulled temperature: ${ws.temperature}°C`);
  }
}
```

## Go deeper

Modern event emitters and message queues (Kafka, RabbitMQ) universally adopt the Push model: events are self-contained message envelopes containing all relevant state deltas. This eliminates the need for consumers to execute synchronous network RPCs back to the producer to retrieve context.

## Watch out

- In the Pull model, ensure the Subject state has completely finished updating before calling notify().
- In the Push model, avoid sending massive multi-megabyte payloads to observers that only needed a tiny boolean flag.

## Remember

- Push models send full state details directly inside the notification arguments.
- Pull models send lightweight alerts and let observers query specific properties from the subject.
- Push is ideal for small focused events; Pull is ideal when observers have diverse, complex data needs.
