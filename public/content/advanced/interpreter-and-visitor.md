---
id: lesson-23
slug: interpreter-and-visitor
title: "Interpreter & Visitor"
level: advanced
order: 23
duration: 18
tags:
  - behavioral
  - interpreter
  - visitor
  - object-structure
  - gof
summary: "Two advanced behavioral patterns that work over object structures — Interpreter represents a small language's grammar as a tree of classes that evaluate themselves, while Visitor lets you add new operations to a structure of objects without modifying their classes, at the cost of making new element types harder to add."
---

# Learning Objectives

By the end of this lesson you will be able to:

- State the **intent** of both **Interpreter** and **Visitor**.
- Build a tiny expression **interpreter** and a **visitor** in TypeScript.
- Explain **double dispatch** and the **expression problem**.
- Judge when these comparatively **rare** patterns are (and aren't) worth it.

# Why It Matters

Both of these patterns operate over a **structure of objects** — typically a tree like an abstract
syntax tree (AST). **Interpreter** turns a small language's grammar into classes that evaluate
themselves. **Visitor** lets you add brand-new operations across a whole object structure *without*
editing those objects' classes. They're the most advanced (and least common) GoF patterns, so the goal
here is to understand them clearly and know when to reach for them — which is: not often.

# Concept Explanation

### Interpreter: a class per grammar rule

> **Given a language, define a representation for its grammar along with an interpreter that uses the
> representation to interpret sentences in the language.** — Gang of Four

Each rule of a simple grammar becomes a class; you build a tree of them and call `interpret` recursively.

```typescript
interface Expr {
  interpret(context: Record<string, number>): number;
}

class Num implements Expr {
  constructor(private value: number) {}
  interpret() { return this.value; }
}
class Variable implements Expr {
  constructor(private name: string) {}
  interpret(ctx: Record<string, number>) { return ctx[this.name] ?? 0; }
}
class Add implements Expr {
  constructor(private left: Expr, private right: Expr) {}
  interpret(ctx: Record<string, number>) { return this.left.interpret(ctx) + this.right.interpret(ctx); }
}

// Represents  x + 3
const expression = new Add(new Variable("x"), new Num(3));
expression.interpret({ x: 4 }); // 7
```

Interpreter suits **simple, stable** grammars (config rules, boolean filters, tiny DSLs). For a real
programming language, hand-rolling a class per rule doesn't scale — a **parser generator** or a proper
parser is the better tool. Be honest about this: Interpreter is rarely the right choice for anything
beyond a small language.

### Visitor: operations separated from elements

> **Represent an operation to be performed on the elements of an object structure. Visitor lets you
> define a new operation without changing the classes of the elements on which it operates.** — Gang of
> Four

Instead of adding a method to every element class for each new operation, you put the operation in a
**visitor** and have elements **accept** it:

```typescript
interface ShapeVisitor {
  visitCircle(c: Circle): string;
  visitSquare(s: Square): string;
}

interface Shape {
  accept(visitor: ShapeVisitor): string;
}

class Circle implements Shape {
  constructor(public radius: number) {}
  accept(v: ShapeVisitor) { return v.visitCircle(this); } // element picks the right method
}
class Square implements Shape {
  constructor(public side: number) {}
  accept(v: ShapeVisitor) { return v.visitSquare(this); }
}

// A new operation is a new visitor — no Shape class changes.
class AreaVisitor implements ShapeVisitor {
  visitCircle(c: Circle) { return `area ${(Math.PI * c.radius ** 2).toFixed(1)}`; }
  visitSquare(s: Square) { return `area ${s.side ** 2}`; }
}

const shapes: Shape[] = [new Circle(2), new Square(3)];
shapes.map((s) => s.accept(new AreaVisitor())); // ["area 12.6", "area 9"]
```

### Double dispatch

Visitor works via **double dispatch**: the call that runs depends on **two** types — the element
(`Circle` vs `Square`) *and* the visitor (`AreaVisitor` vs `ExportVisitor`). `shape.accept(visitor)`
dispatches on the shape, then `visitor.visitCircle(this)` dispatches on the visitor. Most languages
(including TypeScript) only do single dispatch on the receiver, so Visitor simulates the second
dispatch with the `accept` indirection.

### The expression problem (the key trade-off)

Visitor makes one kind of change easy and the other hard:

- **Easy to add a new operation** — write a new visitor; the element classes don't change.
- **Hard to add a new element type** — a new `Triangle` forces you to add `visitTriangle` to **every**
  visitor.

This tension — operations vs types — is the famous **expression problem**. Choose Visitor when you
expect **many operations over a stable set of element types**; avoid it when element types change often.

### How they relate

Both operate over an object structure (often an AST). Interpreter bakes the behavior (evaluation)
**into** the nodes; Visitor pulls operations **out** into separate visitor objects. In fact, teams
often keep a plain AST and use **Visitors** to add operations to it (evaluate, pretty-print,
type-check) rather than putting every operation on the node classes.

### Consequences

- **Interpreter — good:** simple grammars map directly to classes; easy to extend the grammar. **Cost:**
  a class per rule; unwieldy for complex languages.
- **Visitor — good:** add operations without touching elements; gather related behavior in one visitor.
  **Cost:** adding element types is costly; the `accept`/double-dispatch boilerplate; visitors may need
  access to element internals.

# Key Terminology

- **Interpreter** — classes representing grammar rules that evaluate themselves.
- **Visitor** — an object holding an operation applied across an element structure.
- **Double dispatch** — selecting behavior based on two types (element and visitor).
- **Expression problem** — the difficulty of adding both new types and new operations to a structure.

# Options and Trade-offs

| Concern | Interpreter | Visitor | How to choose |
| ------- | ----------- | ------- | ------------- |
| Purpose | Evaluate a small language | Add operations over a structure | Tiny grammar → Interpreter; many operations → Visitor. |
| Adding operations | Add a method to nodes (or use a Visitor) | Add a visitor (easy) | Visitor when operations multiply. |
| Adding element types | Add a class | Update every visitor (hard) | Avoid Visitor if element types change often. |

# Worked Example

Add a second operation to the shapes with **zero** changes to `Circle`/`Square`:

```typescript
class DescribeVisitor implements ShapeVisitor {
  visitCircle(c: Circle) { return `circle r=${c.radius}`; }
  visitSquare(s: Square) { return `square s=${s.side}`; }
}

const shapes: Shape[] = [new Circle(1), new Square(2)];
shapes.map((s) => s.accept(new DescribeVisitor())); // ["circle r=1", "square s=2"]
```

A whole new operation arrived as one new class — but note: adding a `Triangle` would force edits to
both `AreaVisitor` and `DescribeVisitor`.

# Real World Analogy

- **Interpreter** is like a **calculator that understands a formula**: each part of the expression
  (numbers, `+`, variables) knows how to compute itself, and together they evaluate the whole.
- **Visitor** is like a **tax auditor visiting different businesses**: the auditor (visitor) brings the
  operation, and each business (element) says "for me, do the shop version" or "do the factory
  version." Send a *different* auditor (a new operation) and the businesses don't change at all.

# Examples

## Example 1 — Basic: interpret an expression

`new Add(new Variable("x"), new Num(3)).interpret({ x: 4 })` returns 7. Each node interpreted itself and
combined results up the tree.

**Why this works:** grammar rules as classes evaluate recursively over the structure.

## Example 2 — Real-world: multiple operations via Visitor

Compilers and linters keep an AST and run many visitors over it — evaluate, pretty-print, type-check,
optimize — each a separate visitor, none of them modifying the node classes.

**Why this works:** operations that multiply are exactly what Visitor makes cheap to add.

## Example 3 — Pitfall: the wrong tool

Using Interpreter for a full programming language, or Visitor over a set of element types that keeps
growing, leads to pain: a sprawling class-per-rule, or a `visitX` you must add to every visitor.

**Why this bites:** Interpreter doesn't scale to complex grammars, and Visitor punishes new element
types (the expression problem).

# Common Mistakes

- **Using Interpreter for a non-trivial language** instead of a real parser.
- **Choosing Visitor when element types change often** — every new type touches every visitor.
- **Forgetting Visitor needs double dispatch** — the `accept` method is what makes it work.

# Best Practices

- Reserve **Interpreter** for **small, stable** grammars; reach for a parser otherwise.
- Choose **Visitor** when you have **many operations over a stable set of element types**.
- Remember the **expression problem**: Visitor trades easy operations for hard-to-add types.

# Summary

- **Interpreter** represents a small language's grammar as classes that **evaluate themselves** over a
  tree.
- **Visitor** adds **new operations** to an object structure **without changing** the element classes,
  using **double dispatch**.
- Visitor's trade-off is the **expression problem**: easy to add operations, hard to add element types.
- Both are advanced and comparatively **rare**; know when a parser (over Interpreter) or a changing type
  set (against Visitor) makes them the wrong choice.

# Flash Cards

Q: What is the intent of the Interpreter pattern?
A: Given a language, define a representation for its grammar along with an interpreter that uses the representation to interpret sentences in the language.

Q: What is the intent of the Visitor pattern?
A: Represent an operation to be performed on the elements of an object structure, letting you define a new operation without changing the element classes.

Q: What is double dispatch, and where does Visitor use it?
A: Selecting behavior based on two types — the element and the visitor. Visitor uses element.accept(visitor), which then calls visitor.visitConcrete(this), dispatching on both.

Q: What is the expression problem in the context of Visitor?
A: Visitor makes adding new operations easy (a new visitor) but adding new element types hard (every visitor must gain a new visit method).

Q: When is Interpreter the wrong choice?
A: For anything beyond a small, stable grammar — a real programming language needs a proper parser or parser generator, not a class per rule.

Q: How do Interpreter and Visitor relate?
A: Both operate over an object structure (often an AST); Interpreter bakes behavior into the nodes, while Visitor pulls operations out into separate visitor objects (often applied to an AST).

# Exercises

### Easy
State the intent of Interpreter and of Visitor in one sentence each, and name the object structure both
typically operate over.

### Medium
Add a `Multiply` expression to the interpreter example and evaluate `(x + 3) * 2` for `x = 4`. Confirm
the result is 14.

### Challenging
Add a `Triangle` shape to the Visitor example. List every file/class you had to change, and use that to
explain the expression problem — why Visitor makes new operations cheap but new element types expensive.

# Further Reading

- Gamma et al. — *Design Patterns*, "Interpreter" and "Visitor".
- Refactoring.Guru — *Visitor*: <https://refactoring.guru/design-patterns/visitor>
- Refactoring.Guru — *Interpreter (overview)*: <https://refactoring.guru/design-patterns/behavioral-patterns>
