---
slug: dip-vs-di-vs-ioc
title: "DIP vs Dependency Injection vs IoC"
topic: solid-principles
kind: concept
summary: "DIP is a design principle, Dependency Injection is a technique, and Inversion of Control is an architectural style."
tags:
  - solid
  - dip
  - di
  - ioc
  - architecture
related:
  - dependency-inversion-principle
  - singleton-alternatives-modules-di
  - when-to-use-patterns
---

> **In one line:** DIP is the overarching principle, IoC is the architectural pattern, and DI is the specific delivery technique.

## The idea

In software discussions, developers frequently conflate three related terms: **Dependency Inversion Principle (DIP)**, **Inversion of Control (IoC)**, and **Dependency Injection (DI)**. While complementary, they represent distinct concepts at different levels of abstraction.

**DIP (The Principle)**: The architectural guideline stating that modules should depend on abstractions rather than concrete types. It specifies *what* relationships your software should have.

**IoC (The Architectural Pattern)**: The broader concept where the control flow of a program is inverted compared to traditional procedural programming. Instead of custom code calling libraries, a framework calls your custom code (frequently called the "Hollywood Principle": *Don't call us, we'll call you*).

**DI (The Technique)**: The concrete design pattern that supplies dependencies to a class from the outside (via constructor parameters, setter methods, or interfaces) rather than having the class construct them internally with `new`.

| Concept | Category | Core Idea | Real-World Example |
|---|---|---|---|
| **DIP** | Design Principle | Depend on abstract contracts | High-level service imports `interface Logger` |
| **IoC** | Architectural Style | Framework drives control flow | React calling component render cycles |
| **DI** | Implementation Technique | Pass dependencies into constructors | `new OrderService(new StripePayment())` |

> **Tip:** You do not need a heavy IoC container or reflection library to use Dependency Injection. Passing dependencies explicitly into class constructors is termed "Pure DI" or "Manual DI" and is highly idiomatic in TypeScript.

## See it

```typescript
// Pure Constructor Dependency Injection implementing DIP
interface Notifier {
  send(message: string): void;
}

class SmsNotifier implements Notifier {
  send(msg: string): void { console.log(`SMS: ${msg}`); }
}

// AlertManager adheres to DIP (depends on Notifier)
// and uses DI (dependency injected via constructor)
class AlertManager {
  constructor(private notifier: Notifier) {}

  triggerCriticalAlert(text: string): void {
    this.notifier.send(`CRITICAL: ${text}`);
  }
}

// Composition root wires them together
const alerts = new AlertManager(new SmsNotifier());
```

## Go deeper

Martin Fowler highlighted that Inversion of Control is the defining characteristic of frameworks. In a console application, your code controls when user input is solicited. In a GUI framework or Web API framework (like Express or NestJS), the framework runs the event loop and invokes your event handlers. DI is merely one application of IoC specifically applied to dependency management.

## Watch out

- Do not assume using DI automatically satisfies DIP; injecting concrete classes without interfaces still violates DIP.
- Avoid over-complicating small applications with heavy DI containers when constructor arguments suffice.

## Remember

- DIP is the architectural principle that mandates dependency on abstractions.
- IoC is the overarching framework pattern where runtime control flow is inverted.
- DI is the concrete implementation technique of passing dependencies into objects from the outside.
