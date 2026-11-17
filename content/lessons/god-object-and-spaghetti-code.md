---
slug: god-object-and-spaghetti-code
title: "God Object & Spaghetti Code"
topic: architecture-selection
kind: pitfall
summary: "Decompose monolithic god classes and untangle unstructured control flow using encapsulation and separation of concerns."
tags:
  - architecture
  - antipatterns
  - god-object
  - spaghetti-code
  - srp
related:
  - recognizing-software-antipatterns
  - golden-hammer-and-lava-flow
  - single-responsibility-principle
---

> **In one line:** Decompose monolithic God Objects and untangle Spaghetti Code using separation of concerns and clear interfaces.

## The idea

Two of the most notorious code-level anti-patterns in software engineering are the **God Object** (The Blob) and **Spaghetti Code**.

**The God Object**: A single monolithic class that knows too much and does too much. It centralizes 80% of an application's business logic, state management, persistence, and formatting into thousands of lines of code. Surrounding classes are reduced to dumb data holders. The God Object violates the Single Responsibility Principle, creates massive merge conflicts in version control, and makes automated unit testing nearly impossible because instantiating the class requires mocking hundreds of unrelated dependencies.

**Spaghetti Code**: A codebase lacking modular structure, characterized by tangled control flow, deeply nested conditional branching, global variables, and bidirectional dependencies. Tracking the execution path of a single request feels like unraveling a bowl of tangled spaghetti, where modifying any single line causes unpredictable side-effects elsewhere.

| Anti-Pattern | Root Cause | Architectural Solution |
|---|---|---|
| **God Object** | Lazily appending features to an existing working class | Extract cohesive responsibilities into dedicated classes (SRP) |
| **Spaghetti Code** | Unplanned feature accumulation without modular design | Introduce modular boundaries, clean functions, and pipelines |

> **Tip:** To decompose a God Object, group its methods by the stakeholders who request changes. Move each group into a cohesive domain class, leaving the original class as a thin coordinator or Facade.

## See it

```typescript
// Before: The God Object
class ApplicationManager {
  loginUser() { /* ... */ }
  queryDatabase() { /* ... */ }
  renderHtmlPage() { /* ... */ }
  chargeCreditCard() { /* ... */ }
  exportPdfReport() { /* ... */ }
}

// After: Cleanly segregated domain services
class AuthenticationService { login() { /* ... */ } }
class PaymentGateway { charge() { /* ... */ } }
class ReportGenerator { exportPdf() { /* ... */ } }
class UserRepository { query() { /* ... */ } }
```

## Go deeper

Spaghetti code is often the result of "Shotgun Surgery": whenever a business rule changes, developers must make 20 small edits across 15 different files. Decomposing the codebase into cohesive modules and applying the Open/Closed Principle concentrates changes in single files, restoring engineering velocity and predictability.

## Watch out

- Avoid creating "Manager" or "Helper" classes that quickly degenerate into new God Objects.
- Watch out for circular references when breaking a God Object apart into smaller collaborator classes.

## Remember

- God Objects centralize excessive responsibilities into monolithic, untestable classes.
- Spaghetti Code lacks modular boundaries, making execution paths unpredictable and fragile.
- Apply the Single Responsibility Principle to decompose monoliths into cohesive domain services.
