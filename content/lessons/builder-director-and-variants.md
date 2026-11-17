---
slug: builder-director-and-variants
title: "Builder Directors and Immutable Results"
topic: creational-objects
kind: pattern
summary: "Use an optional Director to execute predefined building sequences and produce immutable objects."
tags:
  - creational
  - builder
  - director
  - immutability
related:
  - builder-intent
  - step-by-step-builder
  - fluent-builder-in-typescript
---

> **In one line:** A Director encapsulates predefined construction recipes to reuse standard building sequences.

## The idea

In the full Gang of Four Builder pattern, an optional role called the **Director** coordinates the construction sequence. While the builder knows *how* to build each individual part, the director knows *which order* to call the parts to assemble standard variations.

For example, when constructing computers, the `ComputerBuilder` provides methods like `addCPU()`, `addRAM()`, and `addGPU()`. A `ComputerDirector` provides high-level assembly routines like `buildGamingRig(builder)` or `buildOfficeWorkstation(builder)`.

Separating the Director from the Builder hides complex assembly algorithms and promotes reuse. Client code simply passes a builder to the director, and the director executes the appropriate sequence of construction steps.

| Role | Core Responsibility | Knows |
|---|---|---|
| **Client** | Initiates creation and consumes result | Desired configuration |
| **Director** | Executes predefined assembly recipes | Order and sequence of steps |
| **Builder** | Implements low-level construction steps | How to construct and assemble parts |
| **Product** | The resulting complex assembled object | Domain state and capabilities |

> **Note:** The Director is completely optional. Many modern applications omit the Director and let clients invoke builder methods directly. Include a Director when building sequences are complex and reused across multiple callers.

## See it

```typescript
interface Computer { cpu: string; ram: number; gpu?: string; }

class PCBuilder {
  private pc: Computer = { cpu: 'Intel i3', ram: 8 };

  setCPU(cpu: string) { this.pc.cpu = cpu; }
  setRAM(ram: number) { this.pc.ram = ram; }
  setGPU(gpu: string) { this.pc.gpu = gpu; }
  getResult(): Computer { return { ...this.pc }; }
}

// Director encapsulates standard building recipes
class PCDirector {
  buildGamingRig(builder: PCBuilder): void {
    builder.setCPU('Intel i9');
    builder.setRAM(64);
    builder.setGPU('NVIDIA RTX 4090');
  }
}

const builder = new PCBuilder();
new PCDirector().buildGamingRig(builder);
const gamingPC = builder.getResult();
```

## Go deeper

Another significant benefit of the Builder pattern is producing genuinely immutable objects. In TypeScript, domain objects often expose `readonly` properties. Constructing them step-by-step is impossible if properties are immutable. The builder gathers mutable state internally, and the final `build()` method instantiates the immutable class with the collected parameters.

## Watch out

- Do not introduce a Director if your application only has one-off, unique object configurations.
- Avoid coupling the Director to concrete builders; program the Director against an abstract builder interface.

## Remember

- The Director encapsulates standard construction recipes and step execution orders.
- Builders provide the construction mechanics, while Directors orchestrate the assembly sequence.
- Builder is the premier pattern for constructing complex, validated, immutable domain objects.
