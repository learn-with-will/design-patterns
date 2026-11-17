---
slug: separating-abstraction-implementation
title: "Decoupling Abstraction and Implementation"
topic: structural-adapters
kind: technique
summary: "Structure high-level control logic into abstraction classes that delegate to implementor interface references."
tags:
  - structural
  - bridge
  - typescript
  - architecture
related:
  - bridge-intent
  - bridge-in-cross-platform-code
  - bridge-vs-adapter
---

> **In one line:** Separate high-level user operations from low-level platform execution using bridge delegation.

## The idea

To implement the Bridge pattern effectively in TypeScript, you must cleanly delineate the roles of the **Abstraction** and the **Implementor**.

The **Implementor interface** declares primitive operations (such as `enable()`, `disable()`, `setChannel()`). These primitives reflect concrete platform capabilities. Concrete implementor classes execute these primitives on specific hardware, operating systems, or APIs.

The **Abstraction** defines high-level client-facing business logic (such as a remote control with `togglePower()` or `mute()`). It does not execute platform operations itself; it orchestrates calls to the implementor reference held in its protected fields. Refined abstractions extend this base abstraction to offer advanced features without modifying the implementors, keeping responsibilities cleanly separated.

| Participant | TypeScript Element | Example |
|---|---|---|
| **Abstraction** | Base class holding Implementor | `RemoteControl` |
| **Refined Abstraction** | Extended class with higher-level logic | `AdvancedRemoteControl` |
| **Implementor** | Interface declaring primitive operations | `interface Device` |
| **Concrete Implementor** | Platform-specific execution of primitives | `TvDevice`, `RadioDevice` |

> **Tip:** Client code configures the abstraction by passing the desired implementor into its constructor: `new AdvancedRemote(new TvDevice())`. Clients can even switch the implementor dynamically at runtime!

## See it

```typescript
interface Device {
  isEnabled(): boolean;
  enable(): void;
  disable(): void;
  setVolume(percent: number): void;
}

class RemoteControl {
  constructor(protected device: Device) {}

  togglePower(): void {
    if (this.device.isEnabled()) this.device.disable();
    else this.device.enable();
  }
}

class AdvancedRemote extends RemoteControl {
  mute(): void {
    console.log('Muting device to 0%');
    this.device.setVolume(0);
  }
}
```

## Go deeper

The Bridge pattern exemplifies the Gang of Four's primary mantra: *program to an interface, not an implementation*. The abstraction interacts solely with the abstract `Device` contract. If a new smart home device (e.g., `ProjectorDevice`) is introduced, existing remotes control it immediately without any code modifications, illustrating pristine Open/Closed compliance.

## Watch out

- Avoid making the Implementor interface too high-level; it should supply building-block primitives.
- Do not let the Abstraction expose its internal Implementor instance directly to clients.

## Remember

- The Implementor interface defines low-level platform primitives.
- The Abstraction provides high-level domain operations by composing the implementor.
- Both abstractions and implementors can be extended independently without cross-coupling.
