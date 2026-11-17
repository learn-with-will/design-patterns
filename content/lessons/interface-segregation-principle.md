---
slug: interface-segregation-principle
title: "Interface Segregation Principle (ISP)"
topic: solid-principles
kind: concept
summary: "Clients should not be forced to depend on methods they do not use; prefer fine-grained interfaces."
tags:
  - solid
  - isp
  - interfaces
  - contracts
related:
  - single-responsibility-principle
  - dependency-inversion-principle
  - adapter-intent
---

> **In one line:** Clients should never be forced to depend on interfaces or methods that they do not use.

## The idea

The Interface Segregation Principle (ISP) addresses the pitfall of bloated, monolithic interfaces. Formulated by Robert C. Martin, ISP states: **"Clients should not be forced to depend upon methods that they do not use."**

When an interface grows excessively wide—often called a "fat interface"—it bundles unrelated methods together. Classes implementing this bloated contract are forced to provide dummy implementations, empty stubs, or throw exceptions for methods they do not support.

Furthermore, fat interfaces cause ripple effects. Whenever a method signature changes on the monolithic interface, every implementing class must be recompiled and re-tested, even if that class never consumed the altered method. ISP advocates breaking fat interfaces into small, cohesive, role-specific contracts.

| Metric | Fat Interface | Segregated Interfaces |
|---|---|---|
| **Interface Size** | 10–30 mixed methods | 1–4 focused methods |
| **Coupling** | High: clients depend on unused features | Low: clients depend strictly on needed methods |
| **Class Stubs** | Frequent `throw new Error('Not supported')` | Zero dummy stubs required |
| **Reusability** | Rigid and difficult to satisfy | Highly composable across disparate classes |

> **Tip:** In TypeScript, you can combine multiple segregated interfaces effortlessly using intersection types, such as `type ReadWrite = Readable & Writable`.

## See it

```typescript
// Segregated role interfaces
interface DocumentReader {
  readContent(): string;
}

interface DocumentWriter {
  writeContent(text: string): void;
}

// Read-only client only depends on Reader
class SimpleLogViewer {
  constructor(private source: DocumentReader) {}
  display(): void {
    console.log(this.source.readContent());
  }
}

// Full document editor implements both interfaces
class EditableDocument implements DocumentReader, DocumentWriter {
  private content = '';
  readContent(): string { return this.content; }
  writeContent(text: string): void { this.content = text; }
}
```

## Go deeper

ISP closely mirrors the Single Responsibility Principle, but focuses on the consumer rather than the producer. While SRP dictates how you organize class implementations, ISP dictates how you craft abstraction contracts from the perspective of the calling client code. Role interfaces make API boundaries clean and self-documenting.

## Watch out

- Avoid creating kitchen-sink interfaces like "IUserOperations" containing 50 unrelated account methods.
- Do not over-segregate into single-method interfaces when the operations logically belong to the same atomic transaction.

## Remember

- Clients should not be forced to depend on methods they do not invoke.
- Split monolithic fat interfaces into fine-grained, role-based contracts.
- TypeScript allows seamless composition of segregated interfaces using intersection types.
