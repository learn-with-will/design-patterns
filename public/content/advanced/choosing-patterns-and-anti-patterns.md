---
id: lesson-24
slug: choosing-patterns-and-anti-patterns
title: "Choosing Patterns & Avoiding Anti-Patterns"
level: advanced
order: 24
duration: 18
tags:
  - capstone
  - anti-patterns
  - refactoring
  - yagni
  - design
summary: "The capstone — how to choose the right pattern (or none), why over-engineering and the 'Golden Hammer' are real dangers, how to refactor toward patterns instead of starting with them, the common anti-patterns to avoid, and a note that MVC, Dependency Injection, and Repository live beyond the Gang of Four."
---

# Learning Objectives

By the end of this lesson you will be able to:

- Choose a pattern by starting from the **problem**, not the catalog.
- Explain **YAGNI** and why over-engineering is as harmful as under-designing.
- Refactor **toward** patterns rather than imposing them up front.
- Name common **anti-patterns** and place patterns like MVC/DI **beyond** the GoF.

# Why It Matters

You now know all 23 Gang of Four patterns. The final — and hardest — skill is **judgement**: knowing
which to use, and, just as often, **when to use none**. Patterns are tools; a person who reaches for one
reflexively does more harm than someone who never learned them. This capstone ties the course together
with the wisdom that keeps patterns from becoming a liability.

# Concept Explanation

### Start from the problem, not the catalog

Don't scan the 23 patterns looking for one to apply. Start from the **forces** in your problem and let
the category point you:

- Trouble **creating** objects flexibly? Look at **creational** patterns.
- Trouble **composing** objects or interfaces? Look at **structural** patterns.
- Trouble with **how objects communicate/behave**? Look at **behavioral** patterns.

Then match the specific **intent**. "I need to swap an algorithm" → Strategy. "I need one interface over
many classes" → Facade. The **intent** is the selector, which is why every lesson led with it.

### YAGNI and over-engineering

**"You Aren't Gonna Need It" (YAGNI)** warns against building flexibility for a future that may never
come. A pattern applied speculatively adds classes, indirection, and cognitive load with no payoff —
**over-engineering**. The cost of a pattern is real and immediate; its benefit is only realized if the
change it anticipates actually happens. When in doubt, write the simple code.

### Refactor toward patterns, not from them

The healthiest way patterns enter a codebase is through **refactoring**. You write the straightforward
version; when a real, *recurring* pressure appears (a growing `switch`, a duplicated construction, a
tangle of references), you refactor to the pattern that relieves it. This is the core message of
Martin Fowler's *Refactoring* and Kent Beck's "make it work, make it right, make it fast." Patterns are
a **destination** you refactor toward, not a starting template.

### Common anti-patterns

An **anti-pattern** is a common solution that looks reasonable but causes more harm than good. Watch for:

- **God Object / God Class** — one class that knows or does too much (often a bloated Facade, Mediator,
  or Singleton).
- **Golden Hammer** — over-applying a favorite pattern to every problem ("if all you have is a hammer,
  everything looks like a nail"). The classic disease of someone who just learned patterns.
- **Spaghetti Code** — tangled, structureless control flow with no clear responsibilities.
- **Lava Flow** — dead or mystery code nobody dares remove, hardening in place.
- **Premature optimization / Speculative generality** — complexity added for problems you don't have.

The term "anti-pattern" was popularized by the 1998 book *AntiPatterns* (Brown et al.).

### Combining patterns

Patterns rarely appear alone. An **Abstract Factory** is often built from **Factory Methods**; **Command**
pairs with **Memento** for undo; a **Composite** is frequently walked by an **Iterator** or a **Visitor**;
**Decorator** and **Proxy** share a shape. Real designs weave several patterns together — recognizing the
combinations is part of fluency.

### Beyond the Gang of Four

Not every well-known "pattern" is one of the 23. These are **architectural / enterprise** patterns,
catalogued by others (notably Martin Fowler's *Patterns of Enterprise Application Architecture*):

- **MVC / MVVM** — separating a UI into model, view, and controller/view-model.
- **Dependency Injection** — supplying dependencies from outside (a technique, not a GoF pattern).
- **Repository** — a collection-like interface over data storage.

They're valuable, but label them accurately: **beyond** the GoF catalog, not part of it.

### Patterns depend on the language

Finally, remember the recurring theme: patterns are shaped by the language. In TypeScript, first-class
functions turn **Strategy** and **Command** into functions, and **Iterator** is built in. Peter Norvig
observed that many GoF patterns are "invisible or simpler" in dynamic languages. A pattern is a means to
an end — if the language gives you the end directly, take it.

# Key Terminology

- **YAGNI** — "You Aren't Gonna Need It"; don't build for imagined future needs.
- **Over-engineering** — adding structure/flexibility the problem doesn't need.
- **Anti-pattern** — a common but counterproductive solution.
- **Golden Hammer** — over-applying one familiar pattern everywhere.

# Options and Trade-offs

| Situation | Do this | Not this | Why |
| --------- | ------- | -------- | --- |
| Two fixed cases, no growth | A simple `if` | A Strategy hierarchy | Avoid over-engineering. |
| A recurring pressure appears | Refactor to the fitting pattern | Force a pattern preemptively | Patterns are destinations, not templates. |
| You love one pattern | Match pattern to problem | Golden Hammer it everywhere | The problem selects the pattern, not your habit. |

# Worked Example

A quick decision checklist before adding a pattern:

```text
1. What problem/force am I actually facing right now (not hypothetically)?
2. Which category does it fall in (creational / structural / behavioral)?
3. Which pattern's INTENT matches that force?
4. What does the pattern COST (classes, indirection), and is the benefit real yet?
5. Could simpler code (a function, a parameter, a plain object) do it today?
   → If yes, do that. Refactor to the pattern when the pressure actually arrives.
```

Running this list turns "which pattern is cool?" into "what does this code need?" — the whole shift this
lesson is about.

# Real World Analogy

Knowing patterns without judgement is like a **medical student who just learned every procedure**:
tempted to operate on everything. A seasoned doctor's skill isn't knowing more procedures — it's knowing
**when not to operate**. The best treatment is often rest and simple care. So it is with patterns: the
mark of expertise is restraint.

# Examples

## Example 1 — Basic: choosing by intent

A growing `switch (paymentType)` that keeps gaining cases signals **behavioral** trouble; the intent "swap
interchangeable algorithms" points to **Strategy**. You chose from the problem, not the catalog.

**Why this works:** matching the force to a pattern's intent is how selection is supposed to go.

## Example 2 — Real-world: refactor toward a pattern

You don't design an editor's undo as Command+Memento on day one. You ship simple edits, then, when undo
becomes a requirement, refactor to those patterns. The need pulled the pattern in.

**Why this works:** the pattern arrived to solve a *real* pressure, so its cost buys a real benefit.

## Example 3 — Pitfall: the Golden Hammer

A developer who just learned Singleton makes everything a Singleton; six months later the codebase is
untestable global state.

**Why this bites:** over-applying one pattern is a textbook anti-pattern — the tool chose the problem
instead of the other way around.

# Common Mistakes

- **Starting from the catalog** instead of the problem.
- **Over-engineering** for imagined future needs (violating YAGNI).
- **Golden Hammer** — forcing your favorite pattern everywhere.
- **Miscategorizing** MVC/DI/Repository as GoF patterns.

# Best Practices

- Let the **problem** and the pattern's **intent** drive selection.
- Prefer the **simplest** thing that works; refactor **toward** patterns.
- Watch for **anti-patterns** — especially the God Object and Golden Hammer.
- Know that some patterns (MVC, DI, Repository) live **beyond** the GoF, and that the language may make a
  pattern unnecessary.

# Summary

- Choose patterns by starting from the **problem's forces** and matching a pattern's **intent** — not by
  browsing the catalog.
- Respect **YAGNI**: over-engineering is a real cost, and patterns should be **refactored toward**, not
  imposed.
- Learn the common **anti-patterns** (God Object, Golden Hammer, Spaghetti, Lava Flow) and avoid them.
- Patterns **combine**, some useful ones are **beyond the GoF**, and the **language** can make a pattern
  moot. The real skill is **judgement** — knowing when *not* to use one.

# Flash Cards

Q: How should you choose a design pattern?
A: Start from the problem's forces, use the category (creational/structural/behavioral) as a map, then match the specific pattern by its intent — never start by browsing the catalog for something to apply.

Q: What does YAGNI mean and why does it matter for patterns?
A: "You Aren't Gonna Need It" — don't build flexibility for imagined future needs; a speculatively applied pattern adds cost (classes, indirection) with no guaranteed benefit.

Q: What is the "Golden Hammer" anti-pattern?
A: Over-applying one favorite pattern to every problem ("if all you have is a hammer, everything looks like a nail") — the classic mistake after learning patterns.

Q: What does "refactor toward patterns" mean?
A: Write the simple code first and introduce a pattern during refactoring when a real, recurring pressure appears — patterns are destinations, not starting templates.

Q: Are MVC, Dependency Injection, and Repository Gang of Four patterns?
A: No — they are architectural/enterprise patterns (e.g. from Fowler); DI is a technique. They're useful but sit beyond the 23 GoF patterns.

Q: Give one example of patterns combining.
A: Command pairs with Memento for undo; an Abstract Factory is built from Factory Methods; a Composite is often traversed by an Iterator or a Visitor.

# Exercises

### Easy
Write down the five-step decision checklist from the Worked Example in your own words, and add one
question you personally want to remember to ask before adding a pattern.

### Medium
Find a `switch`/`if-else` chain in your own code that grows when new cases appear. Decide whether
Strategy or State fits, justify the choice by intent, and note whether it's worth refactoring now or
still YAGNI.

### Challenging
Pick a small feature you might build (e.g. a notification system). Sketch a design that combines **two**
patterns (say Observer + Strategy), then argue the opposite case: what's the simplest version with **no**
patterns, and what real pressure would justify adding each one?

# Further Reading

- Gamma et al. — *Design Patterns* (1994), "Conclusion".
- Martin Fowler — *Refactoring* and *Patterns of Enterprise Application Architecture*: <https://martinfowler.com/books/>
- Refactoring.Guru — *Criticism of patterns*: <https://refactoring.guru/design-patterns/criticism>
- SourceMaking — *AntiPatterns*: <https://sourcemaking.com/antipatterns>
