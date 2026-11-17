---
slug: single-responsibility-principle
title: "Single Responsibility Principle (SRP)"
topic: solid-principles
kind: concept
summary: "A class or module should have only one reason to change, focusing entirely on a single responsibility."
tags:
  - solid
  - srp
  - cohesion
  - modularity
related:
  - open-closed-principle
  - interface-segregation-principle
  - dependency-inversion-principle
---

> **In one line:** The Single Responsibility Principle states that a class should have one, and only one, reason to change.

## The idea

The Single Responsibility Principle (SRP) is the foundational first principle of the SOLID guidelines popularized by Robert C. Martin ("Uncle Bob"). SRP states: **"A class should have one, and only one, reason to change."**

In practical software engineering, a "reason to change" corresponds to an actor or stakeholder who requests modifications. If a single class handles database persistence, format rendering, and business calculations, changes requested by the finance department, the database administrator, or the UI team will all force edits to the exact same file.

Classes that violate SRP become bloated "God Objects". They suffer from fragile coupling, where editing report formatting accidentally breaks database transaction logic, resulting in regression bugs and challenging test suites. Dividing responsibilities into cohesive, dedicated classes isolates change.

| Responsibility Type | Violating God Class | SRP Refactored Classes |
|---|---|---|
| Domain Business Logic | `Invoice.calculateTotal()` | `Invoice.calculateTotal()` |
| Persistence & Storage | `Invoice.saveToDatabase()` | `InvoiceRepository.save()` |
| Presentation & Printing | `Invoice.renderAsPdf()` | `InvoicePdfFormatter.render()` |

> **Tip:** High cohesion and loose coupling are the direct results of SRP. When every class handles one cohesive task, code becomes trivial to unit test and reassemble in different configurations.

## See it

```typescript
// SRP in action: Separate data management from persistence and notification
class Order {
  constructor(public id: string, public amount: number) {}
}

class OrderRepository {
  save(order: Order): void {
    console.log(`Persisting order ${order.id} to PostgreSQL`);
  }
}

class NotificationService {
  sendReceipt(order: Order, email: string): void {
    console.log(`Sending receipt for $${order.amount} to ${email}`);
  }
}
```

## Go deeper

SRP applies not only to classes but also to functions, modules, and microservices. When diagnosing whether a module adheres to SRP, describe its purpose in a single sentence. If that sentence contains the word "and" or "also" (e.g., "This class validates user passwords AND saves them to Redis"), it is a clear indicator that the module houses multiple responsibilities.

## Watch out

- Do not take SRP to an extreme where classes contain only a single trivial line; cohesion matters.
- Watch out for hidden responsibilities such as error logging and format conversion mixed into core business logic.

## Remember

- A class should have only one reason to change, aligned with a specific actor or stakeholder.
- Violating SRP creates monolithic God Objects prone to regression bugs during maintenance.
- Splitting responsibilities enhances unit testing simplicity and long-term codebase cohesion.
