---
slug: recognizing-software-antipatterns
title: "Recognizing Common Anti-Patterns"
topic: architecture-selection
kind: concept
summary: "Anti-patterns are recurring patterns of bad software design and practice that lead to fragility and bugs."
tags:
  - architecture
  - antipatterns
  - code-smells
  - fragility
related:
  - god-object-and-spaghetti-code
  - golden-hammer-and-lava-flow
  - how-to-choose-a-design-pattern
---

> **In one line:** Anti-patterns are recurring bad solutions that produce negative consequences, technical debt, and bugs.

## The idea

Just as design patterns capture recurring good solutions to design problems, **anti-patterns** capture recurring **bad solutions** that consistently lead to fragility, bugs, and maintenance failure.

The term was popularized in 1998 by William Brown, Raphael Malveau, Hays McCormick, and Thomas Mowbray in their book *AntiPatterns: Refactoring Software, Architectures, and Projects in Crisis*.

An anti-pattern is not simply a bug or poor syntax; it is a recognizable architectural arrangement that appears beneficial at first glance, but results in severe long-term technical debt and architectural paralysis. Teams that study anti-patterns develop a shared diagnostic vocabulary. Recognizing anti-patterns allows teams to identify structural decay early, understand why earlier well-intentioned decisions went wrong, and execute targeted corrective refactorings before code rot becomes insurmountable.

| Anti-Pattern | Core Symptom | Corrective Action |
|---|---|---|
| **God Object** | One monolithic class controls all application state | Decompose into focused classes using SRP |
| **Spaghetti Code** | Unstructured control flow with tangled jumps | Refactor into structured functions and pipelines |
| **Golden Hammer** | Forcing one favorite pattern into every problem | Match patterns to specific forces; favor simplicity |
| **Lava Flow** | Dead legacy code nobody understands or dares delete | Write automated tests and boldly delete dead code |

> **Note:** A vital element of documenting an anti-pattern is identifying the "refactored solution"—the proven architectural step that extracts the codebase from the trap.

## See it

```typescript
// Example Anti-pattern: Hardcoded Magic Strings & Mixed Concerns
class SystemController {
  // God Object doing everything: DB, Email, UI, Math!
  execute(action: string, payload: any) {
    if (action === 'save_and_email_and_render_report') {
      // 500 lines of mixed procedural database queries,
      // HTML string concatenation, and network calls...
    }
  }
}

// Corrective action: Break down into SRP domain services
```

## Go deeper

Anti-patterns exist at all architectural levels:
- **Code-level**: Magic numbers, deeply nested callbacks, copy-paste programming, and commented-out dead code.
- **Design-level**: God Object, Feature Envy, Circular Dependencies, and Interface Bloat.
- **Architectural-level**: Database-as-IPC, Vendor Lock-in, Distributed Monolith, and Big Ball of Mud.

Understanding both design patterns and anti-patterns gives software engineers a complete 360-degree vision: knowing what proven structures to implement, and recognizing what tempting structural traps to actively avoid.

## Watch out

- Do not label code an anti-pattern simply because it does not use your preferred pattern.
- Watch for well-intentioned architectural patterns decaying into anti-patterns over years of drift.

## Remember

- Anti-patterns are recurring flawed solutions that consistently cause maintenance failure.
- They often look convenient initially but accumulate severe long-term technical debt.
- Documenting anti-patterns equips teams with the vocabulary and refactoring paths to heal legacy code.
