---
slug: subsystem-simplification
title: "Designing Clean Subsystem Facades"
topic: structural-proxies
kind: technique
summary: "Hide complex multipart video converters or payment SDK workflows behind a clear, minimal facade method."
tags:
  - structural
  - facade
  - api-design
  - simplicity
related:
  - facade-intent
  - facade-vs-adapter-vs-mediator
  - when-to-use-patterns
---

> **In one line:** Design facades by identifying common client workflows and exposing clean, coarse-grained methods.

## The idea

The key to designing an effective Facade is to focus on **client use cases** rather than mirroring the underlying subsystem structure.

Begin by identifying the 2 or 3 common workflows that client applications perform 95% of the time. For example, in a home automation subsystem with amplifiers, projectors, streaming devices, and smart lights, the universal client workflow is "watch movie" or "shut down".

Instead of forcing callers to invoke 12 granular setter methods across 4 separate device classes, the `HomeTheaterFacade` exposes `watchMovie(title)` and `endMovie()`. Internally, the facade coordinates the exact sequence of turning on components, dimming lighting, and routing audio.

| Design Rule | Good Facade Practice | Bad Facade Practice |
|---|---|---|
| **Method Granularity** | Coarse-grained (`checkout(cart)`) | Fine-grained pass-through (`step1()`, `step2()`) |
| **State Ownership** | Stateless or minimal lifecycle state | Stores heavy domain business data |
| **Coupling** | Depends on subsystem; clients depend on facade | Exposes subsystem types in public return values |

> **Tip:** You can create multiple focused facades for the same underlying subsystem. If the admin portal and the public user app interact with the same backend, provide an `AdminFacade` and a `UserFacade` tailored to each audience.

## See it

```typescript
class Lights { dim(level: number) { console.log(`Lights at ${level}%`); } }
class Projector { turnOn() { console.log('Projector ON'); } }
class SoundSystem { setVolume(v: number) { console.log(`Volume ${v}`); } }

class HomeTheaterFacade {
  constructor(
    private lights: Lights,
    private projector: Projector,
    private audio: SoundSystem
  ) {}

  watchMovie(title: string): void {
    console.log(`Preparing theater for ${title}...`);
    this.lights.dim(15);
    this.projector.turnOn();
    this.audio.setVolume(20);
  }
}

const theater = new HomeTheaterFacade(new Lights(), new Projector(), new SoundSystem());
theater.watchMovie('Inception');
```

## Go deeper

In microservice and backend architectures, the **API Gateway** pattern is essentially the Facade pattern scaled to distributed systems. When a mobile application needs to render a user profile screen, instead of sending 7 HTTP requests to 7 distinct microservices, it sends a single request to the API Gateway Facade, which fans out requests internally and aggregates the response.

## Watch out

- Do not add business logic or validations into the facade; keep the facade purely an orchestration layer.
- Avoid making the facade a mandatory barrier if clients genuinely need custom subsystem interactions.

## Remember

- Design facades around coarse-grained client workflows rather than subsystem class structures.
- Facades orchestrate complex initialization and call sequences behind single intuitive methods.
- Multiple specialized facades can be built over the same subsystem for different client personas.
