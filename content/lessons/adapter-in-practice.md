---
slug: adapter-in-practice
title: "Implementing Adapters in TypeScript"
topic: structural-adapters
kind: technique
summary: "Wrap legacy services or third-party SDKs with an adapter matching your application's domain interface."
tags:
  - structural
  - adapter
  - typescript
  - integration
related:
  - adapter-intent
  - object-adapter-vs-class-adapter
  - adapter-tradeoffs
---

> **In one line:** Implement robust Adapters in TypeScript by translating data formats and error types into domain standards.

## The idea

In real-world production TypeScript systems, implementing an Adapter involves more than simple method name re-mapping. Production adapters handle three key translation responsibilities:

1. **Method Signature Mapping**: Translating synchronous calls to asynchronous Promises, or adapting parameter ordering and optional arguments.
2. **Data Model Translation**: Converting third-party DTOs, XML structures, or raw snake_case JSON into strongly-typed domain entities with proper validation.
3. **Error Normalization**: Intercepting proprietary third-party exceptions and re-throwing standardized application domain errors.

By encapsulating vendor-specific idiosyncrasies inside the adapter, the core application domain remains completely decoupled from external vendor SDK churn, making testing and maintenance straightforward.

| Responsibility | Raw Third-Party SDK | Domain Interface via Adapter |
|---|---|---|
| **Naming** | `api.v1_charge_card()` | `gateway.processPayment()` |
| **Units** | Amounts in floating-point dollars | Integer cents to prevent rounding bugs |
| **Errors** | Throws `StripeCardError` | Throws domain `PaymentFailedException` |
| **Types** | Untyped dictionary payload | Strongly typed TypeScript interface |

> **Tip:** Always define the Target interface in your domain layer first before writing the adapter. This ensures the contract is designed for your application's needs, rather than mirroring the vendor's API.

## See it

```typescript
interface PaymentResult { success: boolean; transactionId: string; }
interface PaymentService {
  charge(amountCents: number): Promise<PaymentResult>;
}

// External third-party SDK
class ExternalStripeClient {
  async createCharge(params: { val: number }): Promise<{ id: string; status: string }> {
    return { id: 'ch_123', status: 'succeeded' };
  }
}

class StripeAdapter implements PaymentService {
  constructor(private client: ExternalStripeClient) {}

  async charge(cents: number): Promise<PaymentResult> {
    const res = await this.client.createCharge({ val: cents / 100 });
    return { success: res.status === 'succeeded', transactionId: res.id };
  }
}
```

## Go deeper

Adapters are frequently combined with the Repository pattern. When building domain aggregates, the domain defines a repository interface. An infrastructure adapter implements that interface by wrapping an ORM (like Prisma or TypeORM) or raw Redis clients, shielding the domain layer from database changes. This architectural boundary ensures database engine migrations can be performed without altering domain entity logic or validation invariants.

## Watch out

- Do not let third-party types escape through the adapter interface into domain business logic.
- Ensure async/await exceptions from third-party SDKs are caught and normalized properly.

## Remember

- Production adapters translate method signatures, data structures, and exception types.
- Define the target domain interface from the client perspective before implementing the adapter.
- Adapters shield application code from external vendor API deprecations and breaking changes.
