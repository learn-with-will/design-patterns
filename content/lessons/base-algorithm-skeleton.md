---
slug: base-algorithm-skeleton
title: "Designing Algorithmic Skeletons"
topic: behavioral-algorithms
kind: technique
summary: "Write a public final template method calling protected abstract and primitive steps in a fixed sequence."
tags:
  - behavioral
  - template-method
  - typescript
  - architecture
related:
  - template-method-intent
  - hooks-and-abstract-steps
  - template-method-vs-strategy
---

> **In one line:** Design robust algorithmic skeletons in TypeScript by combining public template methods with protected steps.

## The idea

To implement the Template Method pattern effectively in TypeScript, apply clean visibility boundaries:

1. **The Template Method**: Should be marked `public` so clients can invoke it. In languages like Java or C++, it is marked `final` to prevent subclasses from altering the skeleton. In TypeScript, naming conventions and documentation ensure the template method is treated as invariant.
2. **Abstract & Primitive Steps**: Should be marked `protected`. Clients should never invoke individual steps directly from outside the class; steps are intended exclusively for internal orchestration by the template method.
3. **Shared Default Steps**: Place standard common logic directly in the base class so subclasses do not duplicate code.

Algorithmic skeletons enforce architectural compliance. For example, if a compliance audit mandates that security authorization and audit logging must bracket every financial transaction, encoding that invariant sequence into a base template method guarantees that no developer can accidentally bypass security when adding a new transaction type.

| Member | Visibility | Override Rule | Caller |
|---|---|---|---|
| `executeWorkflow()` | `public` | Do not override (invariant skeleton) | Outside client code |
| `stepOne()` | `protected abstract` | Mandatory override | Base template method only |
| `stepTwo()` | `protected` (default) | Optional override | Base template method only |

> **Tip:** By marking step methods `protected`, you keep your public API surface minimal and prevent callers from invoking steps out of order.

## See it

```typescript
abstract class BuildPipeline {
  public runPipeline(): void {
    this.checkoutCode();
    this.runTests();
    this.buildArtifact();
  }

  protected checkoutCode(): void { console.log('Git clone commit'); }
  protected abstract runTests(): void;
  protected abstract buildArtifact(): void;
}

class WebAppPipeline extends BuildPipeline {
  protected runTests() { console.log('npm test'); }
  protected buildArtifact() { console.log('npm run build'); }
}

new WebAppPipeline().runPipeline();
```

## Go deeper

When designing algorithmic skeletons, strike a balance in step granularity. If you break the algorithm into too many microscopic steps, subclasses become tedious to write. If steps are too coarse-grained, subclasses have little flexibility. Aim for 3 to 7 well-defined logical steps. Furthermore, base class template methods should wrap the execution loop in comprehensive error handling, ensuring that telemetry, database rollbacks, and file resource closures are always executed deterministically.

## Watch out

- Never make step methods public unless clients genuinely need to execute them independently.
- Ensure that the base class template method handles errors and resource cleanup properly.

## Remember

- Public template methods execute a fixed sequence of protected step methods.
- Protected visibility restricts step invocation strictly to the orchestrating base class.
- Shared common steps live in the base class to eliminate duplicate code across subclasses.
