---
id: lesson-05
slug: builder
title: "Builder"
level: beginner
order: 5
duration: 16
tags:
  - creational
  - builder
  - construction
  - fluent
  - gof
summary: "The Builder pattern — separate the step-by-step construction of a complex object from its final representation, avoiding unreadable 'telescoping' constructors, with a look at the popular fluent-builder variation in TypeScript."
---

# Learning Objectives

By the end of this lesson you will be able to:

- State the **intent** of the Builder pattern.
- Recognize the **telescoping constructor** problem it solves.
- Implement a **fluent builder** in TypeScript.
- Describe the optional **Director** and when Builder beats a plain constructor.

# Why It Matters

Some objects need many pieces to come together — some required, many optional. Cramming that into one
constructor gives you calls like `new Pizza(12, true, false, true, "thin", [], undefined, true)` where
nobody can tell what the booleans mean. **Builder** constructs the object **step by step**, so each
piece is named and optional pieces are simply skipped.

# Concept Explanation

### Intent

> **Separate the construction of a complex object from its representation so that the same construction
> process can create different representations.** — Gang of Four

### The telescoping constructor problem

When an object has many optional fields, people tend to add overloaded constructors — 2 params, then
3, then 5 — a "telescoping" set that's hard to read and easy to get wrong (which `true` was which?).
Builder replaces it with a series of clearly named steps.

### The fluent builder in TypeScript

The most common modern form returns `this` from each step so calls **chain**:

```typescript
class HttpRequest {
  constructor(
    readonly url: string,
    readonly method: string,
    readonly headers: Record<string, string>,
    readonly body?: string,
  ) {}
}

class HttpRequestBuilder {
  private method = "GET";
  private headers: Record<string, string> = {};
  private body?: string;

  constructor(private url: string) {}

  withMethod(m: string): this { this.method = m; return this; }
  withHeader(key: string, value: string): this { this.headers[key] = value; return this; }
  withBody(body: string): this { this.body = body; return this; }

  build(): HttpRequest {
    return new HttpRequest(this.url, this.method, this.headers, this.body);
  }
}

const request = new HttpRequestBuilder("/api/users")
  .withMethod("POST")
  .withHeader("Content-Type", "application/json")
  .withBody('{"name":"Ada"}')
  .build();
```

Each step reads like a sentence, optional pieces are just omitted, and `build()` produces the finished,
often **immutable**, object.

### The optional Director

GoF's version can include a **Director** — an object that knows a *recipe* (a fixed sequence of builder
calls) and runs it, so the same steps can be reused. It's optional; many codebases skip it and let the
caller drive the builder directly.

```typescript
class RequestDirector {
  static jsonPost(builder: HttpRequestBuilder, body: string) {
    return builder.withMethod("POST").withHeader("Content-Type", "application/json").withBody(body).build();
  }
}
```

### Consequences

- **Good:** readable construction of complex objects; lets you build **different representations** with
  the same steps; can enforce validity in `build()`; supports immutable results.
- **Cost:** an extra builder class per product; overkill for objects with just a couple of fields.

# Key Terminology

- **Builder** — an object that constructs a product step by step.
- **Fluent interface** — methods that return `this` so calls chain.
- **Director** — an optional object that runs a fixed sequence of builder steps (a recipe).
- **Telescoping constructor** — many overloaded constructors with growing parameter lists (the smell
  Builder removes).

# Options and Trade-offs

| Concern | Builder | Big constructor / object literal | How to choose |
| ------- | ------- | -------------------------------- | ------------- |
| Many optional fields | Named, skippable steps | Long positional arg list | Builder when there are many optional/varying parts. |
| Validity | Enforced in `build()` | Scattered checks | Builder centralizes validation. |
| Simplicity | Extra class | Fewest moving parts | A plain object/constructor wins for 1–3 fields. |

# Worked Example

Build two different requests with the *same* steps but different data — the construction process is
reused, the representation differs:

```typescript
const get = new HttpRequestBuilder("/health").build();               // simple GET
const post = new HttpRequestBuilder("/orders")
  .withMethod("POST")
  .withHeader("Authorization", "Bearer abc")
  .withBody("{}")
  .build();                                                          // richer POST
```

Same builder, two representations — exactly what the intent promises.

# Real World Analogy

A Builder is like ordering at a **sandwich shop**. You don't get one giant "sandwich constructor" with
twelve arguments; you go step by step — pick the bread, add fillings, choose sauces, skip what you
don't want — and at the end you receive the finished sandwich. The same ordering process builds a plain
cheese sandwich or a loaded one.

# Examples

## Example 1 — Basic: skipping optional steps

`new HttpRequestBuilder("/health").build()` yields a valid GET with default headers. You provided only
what mattered; the builder supplied sensible defaults.

**Why this works:** optional parts are *omitted*, not passed as a trail of `undefined`s.

## Example 2 — Real-world: query and test-data builders

Builders are everywhere in real code — SQL query builders (`select(...).where(...).limit(...)`) and
"object mother" test builders that create valid domain objects with one field tweaked. Both use the
step-by-step shape to stay readable.

**Why this works:** complex, varying construction becomes a readable chain instead of a wall of
arguments.

## Example 3 — Pitfall: a builder for a two-field object

Wrapping `{ x, y }` in a builder adds a class and ceremony for no benefit — an object literal is
clearer.

**Why this bites:** Builder pays off with **complex** objects; for simple ones it's just extra code.

# Common Mistakes

- **Using Builder for trivial objects.** If a literal or a short constructor is clear, use that.
- **Forgetting to validate in `build()`.** That's the natural place to reject incomplete objects.
- **Confusing it with a Factory.** A factory returns an object in one call; a builder assembles it over
  several steps.

# Best Practices

- Return `this` from steps for a **fluent** chain; return the finished product only from `build()`.
- Make the built product **immutable** where possible.
- Provide sensible **defaults** so optional steps can be skipped.

# Summary

- **Builder** separates step-by-step construction from the final representation.
- It removes the **telescoping constructor** smell and makes complex construction readable.
- The **fluent builder** (return `this`) is the common TypeScript form; a **Director** optionally
  encodes a reusable recipe.
- Use it for **complex** objects with many optional/varying parts — not for simple ones.

# Flash Cards

Q: What is the intent of the Builder pattern?
A: Separate the construction of a complex object from its representation so the same construction process can create different representations.

Q: What problem does Builder solve?
A: The telescoping constructor — long, hard-to-read constructors with many (often optional) positional parameters.

Q: What makes a builder "fluent"?
A: Each step returns `this`, so calls can be chained like `builder.withA().withB().build()`.

Q: What is the Director's role in the GoF Builder?
A: An optional object that runs a fixed sequence of builder steps (a recipe), so a construction process can be reused; many codebases omit it.

Q: How does Builder differ from a Factory?
A: A factory returns an object in a single call; a builder assembles the object over several named steps and produces it with build().

Q: When is Builder the wrong choice?
A: For simple objects with only a few fields — a plain constructor or object literal is clearer and lighter.

# Exercises

### Easy
Rewrite this telescoping call as a fluent builder chain (you can invent the builder methods):
`new Pizza(12, "thin", true, false, ["mushroom"])`.

### Medium
Add a `build()`-time validation to `HttpRequestBuilder` that throws if a `POST` request has no body.
Explain why `build()` is the right place for this check.

### Challenging
Write a small `Director` (or factory function) that produces a "JSON POST" request from a builder, then
show how the same builder can also produce a plain GET. Note what the Director buys you and what it
costs.

# Further Reading

- Gamma et al. — *Design Patterns*, "Builder".
- Refactoring.Guru — *Builder*: <https://refactoring.guru/design-patterns/builder>
- Refactoring.Guru — *Builder in TypeScript*: <https://refactoring.guru/design-patterns/builder/typescript/example>
