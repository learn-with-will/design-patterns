# Design Patterns — Study Pathway

A phase-by-phase map of the 24-lesson course. Take the lessons in order: each builds on the last, and
the foundations (01–02) are assumed by every pattern that follows. All code is **TypeScript**; all
facts trace to the sources in `design-patterns-authoring-prompt.md`.

## Phase 0 — Foundations (lessons 01–02)

Before any pattern, get the shared vocabulary and the principles patterns are built on.

- **01 · What Are Design Patterns?** — where patterns come from (Christopher Alexander → the Gang of
  Four, 1994), what a pattern is (a named, reusable solution to a recurring design problem), the three
  categories (creational, structural, behavioral), a short UML class-diagram primer, the two GoF
  principles ("program to an interface", "favor composition over inheritance"), and — honestly — the
  criticisms and when *not* to reach for a pattern.
- **02 · SOLID Principles** — SRP, OCP, LSP, ISP, DIP: the object-oriented design principles the GoF
  patterns embody. Also clarifies Dependency **Inversion** vs Dependency **Injection** vs **Inversion
  of Control**, which are constantly confused.

## Phase 1 — Creational patterns (lessons 03–07)

How objects get created, so creation is flexible and decoupled from use.

- **03 Factory Method** · **04 Abstract Factory** (families of related objects — and how it differs
  from Factory Method) · **05 Builder** (step-by-step construction of complex objects) · **06
  Prototype** (clone existing objects) · **07 Singleton** (one shared instance — taught with its
  well-known trade-offs and the TypeScript "a module is already a singleton" caveat).

## Phase 2 — Structural patterns (lessons 08–14)

How classes and objects are composed into larger structures.

- **08 Adapter** (convert an interface — the gateway structural pattern, so it closes the beginner
  tier) · **09 Bridge** (split an abstraction from its implementation) · **10 Composite** (tree
  structures treated uniformly) · **11 Decorator** (add behavior dynamically) · **12 Facade** (a simple
  front to a complex subsystem) · **13 Flyweight** (share objects to save memory — the one pattern
  explicitly about resource use) · **14 Proxy** (a stand-in that controls access). Lessons 11–14
  explicitly compare the four "wrapper" patterns so they're never confused.

## Phase 3 — Behavioral patterns (lessons 15–23)

How objects communicate and share responsibility.

- **15 Chain of Responsibility** · **16 Command** (both close the intermediate tier) · **17 Iterator**
  (and how TypeScript's `Symbol.iterator`/generators already give you this) · **18 Mediator** · **19
  Memento** (undo/redo, pairs with Command) · **20 Observer** (one-to-many notification; the basis of
  pub/sub, taught honestly) · **21 Strategy & State** (paired — identical structure, different intent)
  · **22 Template Method** (skeleton in a base class; contrast with Strategy) · **23 Interpreter &
  Visitor** (paired — both operate over object structures; both advanced and comparatively rare).

## Phase 4 — Judgement (lesson 24)

- **24 · Choosing Patterns & Anti-Patterns** — how to pick the right pattern (or none), YAGNI and the
  cost of over-engineering, common anti-patterns (God Object, Golden Hammer, …), refactoring *toward*
  patterns rather than starting with them, combining patterns, and a note that MVC / Dependency
  Injection / Repository are useful patterns **beyond** the GoF catalog.

---

By the end you'll know all **23 Gang of Four patterns** — their intent, structure, trade-offs, and,
just as important, **when to leave them on the shelf**.
