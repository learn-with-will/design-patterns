---
slug: adapter-intent
title: "Adapter: Intent & Interface Translation"
topic: structural-adapters
kind: pattern
summary: "Adapter converts the interface of a class into another interface clients expect, enabling incompatible classes to cooperate."
tags:
  - structural
  - adapter
  - wrapper
  - interfaces
related:
  - object-adapter-vs-class-adapter
  - adapter-in-practice
  - bridge-vs-adapter
---

> **In one line:** Adapter translates an incompatible interface into one expected by clients, acting as a bridge between mismatched APIs.

## The idea

When integrating third-party libraries, legacy codebases, or new microservices, you frequently encounter classes that provide the exact business capability you need, but expose an incompatible interface or method signature.

Modifying the third-party or legacy class directly is often impossible (it may reside in an external vendor package) or unwise (it breaks existing callers).

The Gang of Four's **Adapter** pattern (also called the **Wrapper**) solves this impasse. Its official intent is: **"Convert the interface of a class into another interface clients expect. Adapter lets classes work together that couldn't otherwise because of incompatible interfaces."** An Adapter acts like a physical travel plug adapter: it wraps the existing adaptee object and translates incoming client method calls into method calls the adaptee understands.

| Participant | Role | Example |
|---|---|---|
| **Client** | Invokes operations via the domain interface | Application checkout service |
| **Target** | The domain interface expected by the client | `interface PaymentGateway` |
| **Adaptee** | Existing class with incompatible interface | `class LegacyPayPalSDK` |
| **Adapter** | Implements Target; wraps and delegates to Adaptee | `class PayPalAdapter` |

> **Note:** Adapter changes the *interface* of an object without changing its fundamental *behavior*. The adaptee still performs the underlying work.

## See it

```typescript
// Target interface expected by modern client
interface ModernPayment {
  payInCents(cents: number): void;
}

// Incompatible legacy service (Adaptee)
class LegacyBankSDK {
  makePaymentInDollars(dollars: number): void {
    console.log(`Bank processed $${dollars}`);
  }
}

// Adapter bridges the contract gap
class BankAdapter implements ModernPayment {
  constructor(private legacyBank: LegacyBankSDK) {}

  payInCents(cents: number): void {
    const dollars = cents / 100;
    this.legacyBank.makePaymentInDollars(dollars);
  }
}
```

## Go deeper

Adapter is ubiquitous in modern web architectures. When Node.js and browser environments have diverging APIs (such as `fetch` versus Node's historical `http` module, or Web Streams versus Node Streams), adapters wrap the host-specific APIs into a unified standard interface, enabling isomorphic universal code.

## Watch out

- Do not use an Adapter if you own both classes and can simply refactor the method signatures directly.
- Watch out for data loss when converting complex parameter formats across incompatible interfaces.

## Remember

- Adapter reconciles incompatible interfaces so mismatched classes can cooperate seamlessly.
- The Adapter implements the Target interface and delegates calls to the wrapped Adaptee.
- Adapter alters the interface without modifying the underlying business behavior.
