# Design Patterns Learn

The content of the Design Patterns course at <https://learn-with-will.github.io/design-patterns/>: 100 short lessons ("bites") across 12 topics, each teaching one pattern, principle, or technique in 3–5 minutes, plus a bank of 156 quiz questions.

It covers:
- **Foundations & Core Principles**: GoF catalog, UML diagrams, interfaces, and composition over inheritance.
- **SOLID Principles**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.
- **Creational Patterns**: Factory Method, Abstract Factory, Builder, Prototype, and Singleton.
- **Structural Patterns**: Adapter, Bridge, Composite, Decorator, Facade, Flyweight, and Proxy.
- **Behavioral Patterns**: Chain of Responsibility, Command, Iterator, Mediator, Memento, Observer, State, Strategy, Template Method, Interpreter, and Visitor.
- **Architecture & Anti-Patterns**: Pattern selection heuristics, refactoring toward patterns, YAGNI, God Object, Spaghetti Code, Golden Hammer, and Lava Flow.

This repository holds **content only**. The site itself (lesson reader, quizzes, progress, optional sign-in) is the shared [course shell](https://github.com/learn-with-will/course-shell), which every course uses.

```text
course.json              name, brand colours, home page copy, code languages
content/topics.json      the 12 topics
content/lessons/*.md     one bite per file (100 bites)
content/legacy.json      old long-lesson URLs → the bites that replaced them
quiz/questions.json      the question bank (156 questions)
```

## Working on the course

Clone the shell next to this folder, then run its commands with this folder as the argument:

```bash
git clone https://github.com/learn-with-will/course-shell.git ../course-shell
cd ../course-shell
npm ci
npm run dev -- ../design-patterns                 # live preview at http://localhost:4200
npm run validate -- ../design-patterns --strict   # strict release validation
```

Node 22.18 or later is required.

## Adding a lesson

1. Create `content/lessons/<slug>.md` with front-matter (`slug`, `title`, `topic`, `kind`, `summary`, `tags`, `related`) and the standard sections.
2. Add questions for it to `quiz/questions.json` with `"topic"` and `"lesson"`.
3. Run `npm run validate -- ../design-patterns --strict` from the shell folder.

The rules (length limits, which visual fits which kind of information, the diagram syntax) are in the shell's [CONTENT_GUIDE.md](https://github.com/learn-with-will/course-shell/blob/main/CONTENT_GUIDE.md).

## Accuracy

Design pattern intent, structure, participants, and trade-offs are strictly aligned with Gamma, Helm, Johnson, and Vlissides (*Design Patterns: Elements of Reusable Object-Oriented Software*, Addison-Wesley, 1994) and modern TypeScript object-oriented best practices.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which calls the shell's reusable workflow: it validates this course in strict mode, builds it with the latest shell, and publishes it to GitHub Pages.
