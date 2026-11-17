---
slug: template-method-intent
title: "Template Method: Intent & Algorithm Invariance"
topic: behavioral-algorithms
kind: pattern
summary: "Define the skeleton of an algorithm in an operation, deferring some steps to subclasses without changing its structure."
tags:
  - behavioral
  - template-method
  - algorithms
  - inheritance
  - skeleton
related:
  - base-algorithm-skeleton
  - hooks-and-abstract-steps
  - template-method-vs-strategy
---

> **In one line:** Template Method defines an algorithm's invariant skeleton in a base class, letting subclasses override specific steps.

## The idea

When multiple classes share the exact same sequence of algorithmic steps—such as data processing pipelines that parse, validate, transform, and persist data—copying that overarching sequence into every subclass creates severe code duplication.

If the overarching sequence changes, every subclass must be manually updated.

The Gang of Four's **Template Method** pattern solves this. Its official intent is: **"Define the skeleton of an algorithm in an operation, deferring some steps to subclasses. Template Method lets subclasses redefine certain steps of an algorithm without changing the algorithm's structure."**

The base class defines a public "template method" that coordinates the fixed sequence of steps. Some steps are implemented directly in the base class (invariant logic), while other steps are declared as abstract methods that subclasses must implement (variant logic).

| Step Type | Where Defined | Can Subclass Override? | Purpose |
|---|---|---|---|
| **Template Method** | Base class (final/concrete) | **No** (skeleton is fixed) | Defines invariant step execution sequence |
| **Abstract Step** | Base class (abstract) | **Yes** (mandatory) | Forces subclass to provide custom logic |
| **Concrete Step** | Base class (concrete) | Optional | Provides shared default implementation |
| **Hook Step** | Base class (empty body) | Optional | Provides optional interception point |

> **Note:** Template Method exemplifies the **Hollywood Principle**: *"Don't call us, we'll call you."* The base class calls the subclass methods, inverting traditional procedural control flow.

## See it

```typescript
abstract class DataMiner {
  // The Template Method: fixed invariant execution skeleton
  process(rawData: string): void {
    const data = this.extract(rawData);
    const parsed = this.parse(data);
    this.save(parsed);
  }

  // Invariant step: identical for all formats
  private save(data: unknown) { console.log('Saved to DB'); }

  // Abstract steps: subclasses MUST provide these
  protected abstract extract(raw: string): string;
  protected abstract parse(data: string): unknown;
}

class CsvMiner extends DataMiner {
  protected extract(raw: string) { return raw.trim(); }
  protected parse(data: string) { return data.split(','); }
}
```

## Go deeper

Template Method is the structural backbone of software frameworks. In web application frameworks, test runners (like Jest or Mocha: `beforeEach`, `test`, `afterEach`), and build tools, the framework owns the execution loop (the template method) and calls user-defined hooks and abstract steps at designated lifecycle phases.

## Watch out

- Do not allow subclasses to override the template method itself; protect the invariant sequence.
- Avoid creating template methods with 20+ abstract steps; keep the skeleton focused and cohesive.

## Remember

- Template Method fixes the invariant execution sequence of an algorithm in a base class.
- Subclasses customize specific steps by overriding abstract or hook methods.
- It enforces the Hollywood Principle: the base framework orchestrates when subclass methods run.
