---
id: lesson-22
slug: template-method
title: "Template Method"
level: advanced
order: 22
duration: 15
tags:
  - behavioral
  - template-method
  - inheritance
  - hooks
  - gof
summary: "The Template Method pattern — put the fixed skeleton of an algorithm in a base-class method and let subclasses fill in specific steps, keeping the overall structure constant while varying the details, and how it contrasts with Strategy's composition-based approach."
---

# Learning Objectives

By the end of this lesson you will be able to:

- State the **intent** of the Template Method pattern.
- Implement a template method with abstract steps and **hooks** in TypeScript.
- Explain the **Hollywood Principle** ("don't call us, we'll call you").
- Contrast Template Method (inheritance) with Strategy (composition).

# Why It Matters

Many processes share the **same overall steps** but differ in the details: load → process → save;
prepare → cook → serve; connect → transfer → disconnect. You want the sequence fixed (so it's always
correct) but the individual steps customizable. **Template Method** puts the skeleton in a base class
and lets subclasses override just the steps that vary — reuse the structure, change the details.

# Concept Explanation

### Intent

> **Define the skeleton of an algorithm in an operation, deferring some steps to subclasses. Template
> Method lets subclasses redefine certain steps of an algorithm without changing the algorithm's
> structure.** — Gang of Four

### The participants

- **Abstract Class** — defines the **template method** (the fixed skeleton) and declares the steps: some
  **abstract** (subclasses must implement), some **hooks** with default behavior (subclasses may
  override).
- **Concrete Class** — implements the abstract steps and optionally overrides hooks.

### In TypeScript

```typescript
abstract class DataProcessor {
  // The template method: the fixed algorithm skeleton. Subclasses don't override THIS.
  process(): string {
    const data = this.load();
    const result = this.transform(data); // the varying step
    return this.save(result);
  }

  protected load(): string { return "raw data"; }        // hook with a default
  protected abstract transform(data: string): string;    // required step
  protected save(result: string): string { return `saved: ${result}`; } // hook
}

class UpperCaseProcessor extends DataProcessor {
  protected transform(data: string) { return data.toUpperCase(); }
}
class ReverseProcessor extends DataProcessor {
  protected transform(data: string) { return [...data].reverse().join(""); }
  protected save(result: string) { return `archived: ${result}`; } // override a hook
}

new UpperCaseProcessor().process(); // "saved: RAW DATA"
new ReverseProcessor().process();   // "archived: atad war"
```

`process()` guarantees the order load → transform → save for every subclass. Subclasses only fill in the
steps.

### The Hollywood Principle

Template Method embodies **"Don't call us, we'll call you."** The base class controls the flow and
**calls down** into the subclass's steps at the right moments — the subclass doesn't call the base
class to run the algorithm. This inverted control is what keeps the structure consistent.

### Template Method vs Strategy

Both let you vary part of an algorithm; they differ in mechanism:

- **Template Method** uses **inheritance**: the skeleton is fixed in a base class and subclasses
  override steps. The variation is chosen at **compile time** (by which subclass you instantiate).
- **Strategy** uses **composition**: the whole algorithm is an object you can swap at **runtime**.

Rule of thumb: vary **a few steps** inside a fixed process → Template Method; swap the **entire
algorithm** at runtime → Strategy.

### Consequences

- **Good:** removes duplication by hoisting the common structure into one place; subclasses focus only
  on what differs; enforces the invariant order of steps.
- **Cost:** relies on **inheritance**, which is more rigid than composition; the flow can be hard to
  follow when spread across base and subclasses; changing the skeleton affects all subclasses.

# Key Terminology

- **Template method** — the base-class method holding the fixed algorithm skeleton.
- **Abstract step** — a step subclasses must implement.
- **Hook** — a step with a default that subclasses may override.
- **Hollywood Principle** — the base class calls the subclass steps, not the other way around.

# Options and Trade-offs

| Concern | Template Method | Strategy | How to choose |
| ------- | --------------- | -------- | ------------- |
| Mechanism | Inheritance (override steps) | Composition (swap object) | Template Method for a fixed skeleton; Strategy to swap whole algorithms. |
| Timing | Compile time (subclass) | Runtime (set strategy) | Strategy when the choice is dynamic. |
| What varies | A few steps | The entire algorithm | Steps → Template Method; algorithm → Strategy. |

# Worked Example

A build pipeline with a fixed order and one custom step:

```typescript
abstract class Build {
  run(): string[] {
    return [this.install(), this.compile(), this.test()];
  }
  protected install() { return "npm ci"; }
  protected abstract compile(): string; // varies by language
  protected test() { return "run tests"; }
}
class TsBuild extends Build { protected compile() { return "tsc -b"; } }
class RustBuild extends Build { protected compile() { return "cargo build"; } }
```

Every build installs, compiles, and tests in that order; only `compile()` differs.

# Real World Analogy

Template Method is a **recipe with blanks**. "Make a hot drink" is always: boil water → add the main
ingredient → pour → add condiments. Tea and coffee follow the identical skeleton but fill in different
steps (steep a tea bag vs brew grounds). The recipe's structure is fixed; the specific steps vary.

# Examples

## Example 1 — Basic: overriding one step

`UpperCaseProcessor` and `ReverseProcessor` share `process()` entirely; they differ only in `transform`.
The skeleton ran identically for both.

**Why this works:** the base class owns the sequence; subclasses own the details.

## Example 2 — Real-world: frameworks and lifecycle hooks

Framework base classes define a lifecycle (e.g. `setUp → runTest → tearDown`) and call your overridden
hooks at the right time. You fill in the steps; the framework runs the skeleton.

**Why this works:** the framework enforces the correct order while letting you customize the pieces —
the Hollywood Principle in action.

## Example 3 — Pitfall: rigid inheritance

If you need to combine variations (upper-casing *and* a different save *and* a different load), a single
inheritance chain gets awkward — you can't mix subclasses. Strategy or Decorator would compose better.

**Why this bites:** Template Method's reliance on inheritance limits how variations combine.

# Common Mistakes

- **Confusing it with Strategy.** Template Method is inheritance and a fixed skeleton; Strategy is
  composition and a swappable algorithm.
- **Making the template method overridable.** The skeleton should be stable; only the steps vary.
- **Overusing inheritance** where composition would combine variations more flexibly.

# Best Practices

- Keep the **template method stable**; expose variation only through steps and hooks.
- Give hooks **sensible defaults** so subclasses override only what they need.
- Prefer **Strategy/composition** when variations must combine or change at runtime.

# Summary

- **Template Method** fixes an algorithm's **skeleton** in a base class and lets subclasses fill in
  specific **steps**.
- It uses **inheritance** and follows the **Hollywood Principle** (the base class calls the steps).
- It contrasts with **Strategy**, which swaps a whole algorithm via **composition** at runtime.
- Great for reuse of a fixed structure; limited by inheritance's rigidity.

# Flash Cards

Q: What is the intent of the Template Method pattern?
A: Define the skeleton of an algorithm in a method, deferring some steps to subclasses so they can redefine those steps without changing the algorithm's structure.

Q: What is the difference between an abstract step and a hook in Template Method?
A: An abstract step must be implemented by subclasses; a hook has a default implementation subclasses may optionally override.

Q: What is the Hollywood Principle?
A: "Don't call us, we'll call you" — the base class controls the flow and calls down into the subclass's steps, rather than the subclass driving the algorithm.

Q: How does Template Method differ from Strategy?
A: Template Method uses inheritance with a fixed skeleton and overridable steps (chosen at compile time); Strategy uses composition to swap an entire algorithm object at runtime.

Q: When should the algorithm vary by whole algorithm rather than by steps?
A: Use Strategy — swap the entire algorithm at runtime; use Template Method when only a few steps of a fixed process vary.

Q: What is the main limitation of Template Method?
A: It relies on inheritance, which is rigid — variations can't be easily combined the way composition (Strategy/Decorator) allows.

# Exercises

### Easy
List the fixed steps of `DataProcessor.process()` and say which one `UpperCaseProcessor` changes.

### Medium
Add a `hook` `validate()` to `DataProcessor` that does nothing by default but, when overridden, checks
the data before transforming. Implement a subclass that uses it.

### Challenging
Take the `Build` example and argue where Strategy would serve better — for instance, if you needed to
combine a custom `compile` with a custom `test` independently. Sketch how a composition-based design
would allow that.

# Further Reading

- Gamma et al. — *Design Patterns*, "Template Method".
- Refactoring.Guru — *Template Method*: <https://refactoring.guru/design-patterns/template-method>
- Refactoring.Guru — *Template Method vs Strategy*: <https://refactoring.guru/design-patterns/strategy>
