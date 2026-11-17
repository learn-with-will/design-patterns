---
slug: wrapping-behavior-dynamically
title: "Implementing Decorators in TypeScript"
topic: structural-composition
kind: technique
summary: "Wrap target instances with decorator classes implementing the same interface and delegating with added behavior."
tags:
  - structural
  - decorator
  - typescript
  - composition
related:
  - decorator-intent
  - stacking-multiple-decorators
  - decorator-vs-inheritance
---

> **In one line:** Implement Decorators in TypeScript by delegating calls to an internal component and layering added logic.

## The idea

Implementing the Decorator pattern in TypeScript involves three straightforward structural steps:

1. **Shared Interface**: Declare a `Component` interface defining the operations that can be decorated.
2. **Base Decorator**: Create an abstract decorator class that implements the `Component` interface and accepts an instance of `Component` in its constructor. Its default implementations simply forward calls to the wrapped instance.
3. **Concrete Decorators**: Extend the base decorator and override specific methods. In each overridden method, call `super.operation()` (or `this.wrapped.operation()`), layering additional logic either before or after the delegation.

Client code interacts with the outermost decorator exclusively through the `Component` interface, oblivious to how many layers of decoration are active.

| Step | Action | TypeScript Construct |
|---|---|---|
| **1. Define Interface** | Set the common contract | `interface DataSource { writeData(data: string): void; }` |
| **2. Base Decorator** | Forward all calls | `class DataSourceDecorator implements DataSource { ... }` |
| **3. Pre-Processing** | Execute logic before delegating | Encrypt or validate payload before forwarding |
| **4. Post-Processing** | Execute logic after delegating | Log execution duration or audit trail after call completes |

> **Tip:** By making the base decorator class abstract, you ensure that every concrete decorator only overrides the specific methods it intends to modify, inheriting default delegation for everything else.

## See it

```typescript
interface DataSource {
  writeData(data: string): void;
}

class FileDataSource implements DataSource {
  writeData(data: string) { console.log(`Writing raw: ${data}`); }
}

class EncryptionDecorator implements DataSource {
  constructor(private source: DataSource) {}

  writeData(data: string): void {
    // 1. Pre-process: Encrypt data before forwarding
    const encrypted = `[ENCRYPTED:${data}]`;
    // 2. Delegate to wrapped component
    this.source.writeData(encrypted);
  }
}

const file = new FileDataSource();
const secureFile = new EncryptionDecorator(file);
secureFile.writeData('Confidential info');
```

## Go deeper

Decorators can add brand new methods that are not part of the original Component interface. However, doing so breaks uniformity: clients can only call those new methods if they type-check and cast the object to the concrete decorator class, losing the polymorphic benefits of the pattern. It is best to stick strictly to the shared interface.

## Watch out

- Avoid modifying the incoming parameters or return types in ways that violate the Component contract.
- Ensure that the decorator properly handles asynchronous Promise rejections when decorating async methods.

## Remember

- Decorators accept a component reference in their constructor and implement the same contract.
- Added behavior can execute before, after, or around the delegated method call.
- Clients invoke the outermost decorator without knowing how many wrappers exist underneath.
