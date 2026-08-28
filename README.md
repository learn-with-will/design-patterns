# Design Patterns Learning Portal

A **frontend-only** Design Patterns course: read Markdown lessons, take quizzes, and track
your progress — all in the browser. No sign-up, no backend.

## What this is

The portal shell is built with React 19, Vite, TypeScript, React Router, Tailwind CSS v4,
`marked`, and PrismJS. It renders a **24-lesson curriculum** that takes you from "what is a design
pattern?" and the **SOLID** principles through all **23 Gang of Four (GoF) patterns** — the five
creational, seven structural, and eleven behavioral patterns — finishing with how to choose a
pattern, refactor toward one, and avoid over-engineering. Every code example is written in
**TypeScript**, in plain, welcoming English, and verified against primary sources (see **Sources**
below).

Progress, bookmarks, and quiz scores live in `localStorage` under `design-patterns-learning-*` keys,
so nothing leaves your machine.

## Run it locally

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build
```

## How the content works

The app is **data-driven** — adding a lesson needs no code changes:

1. Write the lesson Markdown in `public/content/<level>/<slug>.md` with YAML front-matter
   (including a `summary`).
2. Add a quiz at `public/quizzes/lesson-NN.json`.
3. Regenerate `public/content/course-manifest.json` from the front-matter (the manifest is
   generated, so it can't drift).

> **Code fences** must declare one of the highlighted languages: `typescript` (the primary language
> for every pattern example), `bash` (the occasional shell command), `json` (small config snippets),
> or `text` (console output, UML sketches, directory trees); see `src/core/prism.ts`.

## Curriculum

**Beginner — foundations & creational patterns:** what are design patterns? · SOLID principles ·
Factory Method · Abstract Factory · Builder · Prototype · Singleton · Adapter.

**Intermediate — structural & first behavioral patterns:** Bridge · Composite · Decorator · Facade ·
Flyweight · Proxy · Chain of Responsibility · Command.

**Advanced — behavioral patterns & putting it together:** Iterator · Mediator · Memento · Observer ·
Strategy & State · Template Method · Interpreter & Visitor · choosing patterns & anti-patterns.

## Accuracy: no hallucination

Every definition, intent, and claim is verified against primary sources. The per-lesson authoring
contract lives in `prompts/design-patterns-authoring-prompt.md`, and the phase-by-phase overview in
`prompts/design-patterns-study-pathway.md`.

**Sources:**

- **_Design Patterns: Elements of Reusable Object-Oriented Software_** — Gamma, Helm, Johnson &
  Vlissides (the "Gang of Four", 1994) — the canonical catalog of the 23 patterns.
- **Refactoring.Guru** — <https://refactoring.guru/design-patterns> — modern explanations with
  TypeScript examples.
- **SourceMaking** — <https://sourcemaking.com/design_patterns> — pattern catalog and anti-patterns.
- **_Head First Design Patterns_** — Freeman & Robson (O'Reilly) — a beginner-friendly companion.
- **Robert C. Martin** — the SOLID principles and _Clean Architecture_.
- **Martin Fowler** — <https://martinfowler.com/> and _Patterns of Enterprise Application
  Architecture_ (e.g. Inversion of Control vs Dependency Injection).
- **The TypeScript Handbook** — <https://www.typescriptlang.org/docs/> — for idiomatic TypeScript
  (interfaces, abstract classes, generics).

## Deploying

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds with
`BASE_PATH=/<repo>/` and publishes `dist/` to GitHub Pages.

---

React 19 · Vite · TypeScript · React Router · Tailwind CSS v4 · marked · PrismJS ·
localStorage.
