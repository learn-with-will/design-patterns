---
slug: golden-hammer-and-lava-flow
title: "Golden Hammer & Lava Flow"
topic: architecture-selection
kind: pitfall
summary: "Avoid treating one favorite pattern as a universal cure, and eliminate abandoned dead code with bold refactoring."
tags:
  - architecture
  - antipatterns
  - golden-hammer
  - lava-flow
  - refactoring
related:
  - recognizing-software-antipatterns
  - god-object-and-spaghetti-code
  - avoiding-overengineering-yagni
---

> **In one line:** Avoid the Golden Hammer trap of overusing one tool, and eradicate obsolete Lava Flow dead code.

## The idea

Two subtle but destructive architectural anti-patterns that infect maturing codebases are the **Golden Hammer** and **Lava Flow**.

**The Golden Hammer**: Derived from the adage *"If all you have is a hammer, everything looks like a nail."* A developer or team falls in love with one specific technology or design pattern (e.g., Microservices, Event Sourcing, RxJS, or Singleton) and insists on applying it to every problem, regardless of fit. This is often driven by cargo-cult programming, where tools are chosen for their prestige rather than their alignment with problem forces.

**Lava Flow**: In older codebases, you frequently discover bizarre classes, obsolete flags, and convoluted helper methods that nobody understands. The original developers have left the company, no tests explain why the code exists, and the current team is terrified that deleting it will crash production. Like cooling volcanic lava, obsolete code solidifies and suffocates the codebase under layers of dead weight.

| Anti-Pattern | Psychological Cause | Antidote |
|---|---|---|
| **Golden Hammer** | Over-familiarity with one pattern; fear of the unfamiliar | Broaden architectural literacy; choose tools based on problem forces |
| **Lava Flow** | Fear of breaking untested legacy systems | Write automated characterization tests and delete dead code boldly |

> **Tip:** Use static analysis tools (like ts-prune or Knip) and code coverage tools to detect and safely eliminate dead, unreferenced Lava Flow code in your TypeScript repositories.

## See it

```typescript
// Example: Golden Hammer applying RxJS Observables to add two numbers!
// import { of } from 'rxjs'; import { map } from 'rxjs/operators';
// of(5).pipe(map(n => n + 10)).subscribe(console.log); // Overkill!

// Pragmatic: Simple language construct
const result = 5 + 10;
console.log(result);

// Example: Lava Flow dead code trap
function legacyCompatV1_DO_NOT_TOUCH(x: any) {
  // Nobody knows what this does, but it's been here since 2018!
  // Antidote: Verify references, write tests, and DELETE IT!
}
```

## Go deeper

Git version control provides the ultimate safety net against Lava Flow. Developers often leave commented-out code or dead classes "just in case we need it later." Remind your team: **Git remembers everything.** You can delete obsolete code with complete confidence, knowing that if you ever need it in the future, it is safely preserved in git history.

## Watch out

- Never leave commented-out dead code in production repositories; delete it cleanly.
- Challenge team members who propose the same favorite pattern for completely unrelated problems.

## Remember

- Golden Hammer is the dogmatic overuse of one favorite pattern or tool for every problem.
- Lava Flow is the accumulation of obsolete, fearful dead code that solidifies over time.
- Rely on automated tests and git history to boldly delete unreferenced dead code.
