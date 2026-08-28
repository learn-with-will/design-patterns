# Design Patterns Course — Authoring Prompt & No-Hallucination Contract

This file is the contract for writing and maintaining the **Design Patterns** course in this repo.
Every lesson and quiz must obey it. The goal: a beginner-friendly, **source-verified** course on the
**23 Gang of Four (GoF) design patterns** in **TypeScript**, plus the SOLID principles and the
judgement to use patterns well — with **zero invented facts**.

## Audience & voice

- **Suitable for everyone.** Assume the reader can read simple code but is new to design patterns and
  may be shaky on object-oriented ideas (interfaces, inheritance, polymorphism). Define every term the
  first time it appears. Prefer short sentences and concrete examples. The two OOP-heavy foundations
  (lessons 01–02) exist so nobody is left behind.
- Explain the **why**, not just the how. Use **one plain-language analogy per lesson**.
- Be honest about limits. Patterns are a vocabulary and a toolbox, **not** a goal. Never imply "more
  patterns = better code." Name when a pattern is overkill, and say so plainly. A design-patterns
  course that produces over-engineering has failed.
- Keep code **minimal, runnable, and idiomatic TypeScript**. Show the smallest example that makes the
  structure clear. Prefer `interface`/`abstract class` where the pattern is about a contract. Compile
  mentally: no invented APIs, no pseudo-methods presented as real.

## Currency & honesty

- Design patterns themselves are stable (the GoF catalog is from 1994 and has not changed). What
  drifts is **language features** and **library APIs** — so when you mention a TypeScript/JavaScript
  feature, it must be real and current (e.g. `#private` fields, `Symbol.iterator`, generators, the
  built-in `Proxy` object). Say "as of writing" for anything version-dependent, and link current docs.
- **No invented benchmarks or "fastest/best" claims.** Patterns are about design, maintainability, and
  communication — **not speed**. The only GoF pattern whose stated purpose is resource/memory use is
  **Flyweight**; do not claim other patterns "improve performance."
- Do not present contested opinions as settled fact. Where practitioners genuinely disagree (e.g.
  Singleton, or whether a pattern is needed at all in a language with first-class functions), present
  it **as a trade-off**, cited, not as a verdict.

## Authoritative sources (cite these; do not invent)

- **_Design Patterns: Elements of Reusable Object-Oriented Software_**, Gamma, Helm, Johnson &
  Vlissides ("Gang of Four", Addison-Wesley, 1994) — the canonical catalog. Each pattern's **Intent**,
  category, and structure trace to here.
- **Refactoring.Guru** — https://refactoring.guru/design-patterns — modern, well-illustrated
  explanations with **TypeScript** examples; good for intent, structure, applicability, pros/cons.
- **SourceMaking** — https://sourcemaking.com/design_patterns — pattern catalog and **anti-patterns**.
- **_Head First Design Patterns_**, Freeman & Robson (O'Reilly) — beginner-friendly framing and the
  "design principles" (e.g. "favor composition over inheritance", "program to an interface").
- **Robert C. Martin** — the **SOLID** principles (his articles and _Agile Software Development,
  Principles, Patterns, and Practices_ / _Clean Architecture_). The acronym **SOLID** was coined by
  **Michael Feathers**; the underlying principles are Martin's (LSP is **Barbara Liskov**'s).
- **Martin Fowler** — https://martinfowler.com/ (e.g. "Inversion of Control Containers and the
  Dependency Injection pattern") and _Patterns of Enterprise Application Architecture_ — for
  distinguishing patterns beyond GoF (DI, Repository, MVC) and clarifying IoC/DI/DIP.
- **Christopher Alexander** — _A Pattern Language_ / _The Timeless Way of Building_ — the architectural
  origin of the word "pattern" (history only).
- **The TypeScript Handbook** — https://www.typescriptlang.org/docs/ — and **MDN**
  https://developer.mozilla.org/ — for language features (iterators/generators, `Proxy`, classes).

If a claim isn't backed by one of these (or another primary source), don't write it. If unsure,
qualify it or leave it out.

## High-risk facts to get right (anti-hallucination checklist)

These are the classic places design-patterns material goes wrong. Getting them right is the point.

1. **The catalog is exactly 23 patterns**, grouped by GoF into **5 creational, 7 structural, 11
   behavioral**. Never miscount or move a pattern between groups.
   - **Creational (5):** Factory Method, Abstract Factory, Builder, Prototype, Singleton.
   - **Structural (7):** Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy.
   - **Behavioral (11):** Chain of Responsibility, Command, Interpreter, Iterator, Mediator, Memento,
     Observer, State, Strategy, Template Method, Visitor.
2. **Each pattern's _intent_ must match GoF** — don't blur the four commonly-confused "wrapper"
   patterns. **Adapter** converts one interface to another the client expects (makes incompatible
   things work together). **Facade** provides a simple interface to a complex subsystem. **Decorator**
   adds responsibilities to an object dynamically without subclassing. **Proxy** provides a surrogate
   that **controls access** to another object (same interface). State these distinctions explicitly.
3. **Strategy vs State** — nearly **identical structure**, **different intent**. Strategy =
   interchangeable **algorithms** the client selects; the strategies don't know about each other.
   State = an object's **behavior changes with its internal state**, and states often trigger the
   **transitions** between themselves. Do not conflate them.
4. **Factory Method vs Abstract Factory** — Factory Method defers instantiation of **one product** to
   subclasses (via inheritance/overriding a method). Abstract Factory creates **families of related
   products** (via an object you compose in). Don't swap these.
5. **Singleton is controversial.** Present it honestly: it introduces **global state**, hides
   dependencies, and makes unit testing harder; many consider it an anti-pattern. Also note that in
   TypeScript/JS a **module** already gives you one shared instance, so the classic Singleton is often
   unnecessary. Give the trade-offs; do not present it as a "best practice."
6. **Patterns are language-dependent.** In languages with first-class functions (TypeScript/JS
   included), several GoF patterns collapse to much simpler code — **Strategy** and **Command** are
   often just functions; **Iterator** is built in (`Symbol.iterator`, generators). Peter Norvig
   famously observed that many GoF patterns are "invisible or simpler" in dynamic languages. Say this;
   don't pretend every pattern needs a class hierarchy in TS.
7. **The two GoF design principles**: **"Program to an interface, not an implementation"** and
   **"Favor object composition over class inheritance."** Quote them accurately and attribute to GoF.
8. **Patterns ≠ silver bullet.** They can add indirection and complexity. Teach **YAGNI** ("You Aren't
   Gonna Need It") and warn against applying a pattern speculatively. The right time is usually when a
   real, recurring pressure appears — often during **refactoring**.
9. **SOLID, precisely.** SRP = a class should have one reason to change. OCP = open for extension,
   closed for modification. LSP = subtypes must be substitutable for their base type (Liskov). ISP =
   many small client-specific interfaces beat one fat one. DIP = depend on **abstractions**, not
   concretions. Attribute SOLID to Robert C. Martin (acronym by Michael Feathers).
10. **DIP ≠ DI ≠ IoC.** **Dependency Inversion** is a design **principle** (depend on abstractions).
    **Dependency Injection** is a **technique** (pass dependencies in instead of `new`-ing them
    inside). **Inversion of Control** is the broader idea that a framework calls your code. They are
    related but **not synonyms** (cite Fowler). DI is **not** a GoF pattern.
11. **MVC, Repository, DI, MVVM, etc. are _not_ GoF patterns.** If mentioned, label them clearly as
    **architectural/enterprise patterns** (Fowler et al.), separate from the 23.
12. **Observer honestly.** Observer defines a one-to-many dependency so dependents are notified of
    changes; it underlies pub/sub and reactive libraries but is **not identical** to them. Note that
    Java **deprecated** `java.util.Observer`/`Observable` (Java 9) — a caution against the naive
    implementation — while keeping the point that the pattern itself is sound. Watch for **memory
    leaks** from un-removed observers.
13. **UML notation** (if you draw class diagrams as `text`): get the relationships right — inheritance
    /generalization (hollow triangle), interface realization (hollow triangle + dashed line),
    association (line), aggregation (hollow diamond), composition (filled diamond), dependency (dashed
    arrow). Keep diagrams as plain `text` ASCII; don't invent a notation.
14. **"Gang of Four"** = the **four** authors (Gamma, Helm, Johnson, Vlissides), 1994. The word
    "pattern" in software is adapted from architect **Christopher Alexander**. Don't misattribute.
15. **Anti-patterns** are recurring **bad** solutions (e.g. God Object, Spaghetti Code, Golden Hammer,
    Lava Flow). The term was popularized by the book _AntiPatterns_ (Brown et al., 1998); "Golden
    Hammer" captures over-using one favourite pattern. Define any anti-pattern you name accurately.

## Lesson structure (match the shell + the other courses)

Front-matter (YAML): `id` (`lesson-NN`), `slug`, `title`, `level` (`beginner|intermediate|advanced`),
`order` (1–24), `duration` (minutes), `tags` (exactly 5), `summary` (one sentence — used to generate
the manifest). Then these H1 (`#`) sections, in order:

`Learning Objectives` · `Why It Matters` · `Concept Explanation` (use `###` subsections) ·
`Key Terminology` · `Options and Trade-offs` (a table) · `Worked Example` · `Real World Analogy` ·
`Examples` (`## Example 1/2/3`: basic, real-world, pitfall) · `Common Mistakes` · `Best Practices` ·
`Summary` · `Flash Cards` (≥5 `Q:`/`A:` pairs; put 6) · `Exercises` (`### Easy/Medium/Challenging`) ·
`Further Reading` (links to the sources above).

For a **pattern** lesson, the `Concept Explanation` should cover, in plain language: the **problem**
it solves, the **intent** (GoF), the **structure/participants** (a small `text` UML sketch is
welcome), **when to use it / applicability**, and **consequences (pros & cons)**. Always include at
least one honest "**when _not_ to use this**" note.

## Code fences (only these languages — enforced by the validator)

`typescript` (**primary** — every pattern example), `bash` (the occasional shell/setup command),
`json` (small config snippets such as `tsconfig`), `text` (console output, ASCII UML sketches,
directory trees). **No other fence languages** (no `ts`, `js`, `java`, etc. — use `typescript`).

## Curriculum (24 lessons, 8/8/8) — all 23 GoF patterns covered

**Beginner (foundations + creational):**
01 what-are-design-patterns · 02 solid-principles · 03 factory-method · 04 abstract-factory ·
05 builder · 06 prototype · 07 singleton · 08 adapter.

**Intermediate (structural + first behavioral):**
09 bridge · 10 composite · 11 decorator · 12 facade · 13 flyweight · 14 proxy ·
15 chain-of-responsibility · 16 command.

**Advanced (behavioral + capstone):**
17 iterator · 18 mediator · 19 memento · 20 observer · 21 strategy-and-state ·
22 template-method · 23 interpreter-and-visitor · 24 choosing-patterns-and-anti-patterns.

Two lessons deliberately pair two patterns each — **21 Strategy & State** (same structure, different
intent) and **23 Interpreter & Visitor** (both operate over object structures; both advanced) — so all
**23 GoF patterns** are covered alongside real foundations and a capstone. Each such lesson must give
both patterns full treatment and an explicit compare-and-contrast.

## Quizzes

One per lesson: `public/quizzes/lesson-NN.json`, `id` `quiz-lesson-NN`, `lessonId` `lesson-NN`,
`passingScore` 60, 5–6 questions spanning the five types (`single-choice`, `multiple-choice`,
`fill-blank`, `ordering`, `match-pair`). Every answer must be traceable to the lesson text; add an
`explanation` to each. Keep `fill-blank` answers short and provide case variants. Use quizzes to
reinforce the anti-hallucination points above — especially **intent distinctions** (Adapter vs Facade
vs Decorator vs Proxy), **Strategy vs State**, **Factory Method vs Abstract Factory**, the **Singleton
trade-offs**, **SOLID vs DI vs DIP**, and **when _not_ to use a pattern**.
