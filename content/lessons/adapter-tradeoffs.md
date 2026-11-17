---
slug: adapter-tradeoffs
title: "Adapter Trade-offs & Indirection"
topic: structural-adapters
kind: pitfall
summary: "Adapters add wrapper objects and boilerplate; change the original interface directly when you own all code."
tags:
  - structural
  - adapter
  - tradeoffs
  - pitfall
related:
  - adapter-intent
  - facade-vs-adapter-vs-mediator
  - bridge-vs-adapter
---

> **In one line:** Adapters add boilerplate and indirection; prefer direct refactoring when you have full ownership of both APIs.

## The idea

While the Adapter pattern is essential when integrating external or legacy code, it introduces architectural overhead that should not be adopted blindly when simpler solutions exist.

The main trade-off is the addition of extra classes, interfaces, and delegation calls. Every adapter introduces a layer of indirection: when debugging, tracing a method call requires stepping through the adapter wrapper into the adaptee.

If both the calling client and the target class reside within the same application codebase and are owned by the same team, introducing an Adapter is often an unnecessary complication. The cleaner, more maintainable approach is to refactor the original class directly to match the desired interface. Direct modification eliminates redundant abstractions and reduces cognitive friction during code reviews.

| Scenario | Recommended Strategy | Rationale |
|---|---|---|
| Third-party npm package | Use **Adapter** | You cannot modify package source code |
| Legacy service shared by other apps | Use **Adapter** | Modifying legacy API breaks external consumers |
| Internal module owned by your team | **Direct Refactoring** | Eliminates useless wrapper layers and indirection |
| Temporary migration between APIs | Use **Adapter** | Allows incremental transition before deprecation |

> **Watch out:** Do not create adapters preemptively for hypothetical future vendor swaps that may never happen. Apply adapters when you actually need to bridge two mismatched systems.

## See it

```typescript
// Over-engineered: Adapter between two classes in the exact same file
class InternalMailer {
  sendEmail(to: string, text: string) { console.log(text); }
}

// Unnecessary boilerplate if you can just rename sendEmail()!
class MailerAdapter {
  constructor(private mailer: InternalMailer) {}
  send(recipient: string, message: string) {
    this.mailer.sendEmail(recipient, message);
  }
}

// Better: Refactor InternalMailer directly to have a clean send() method
class RefactoredMailer {
  send(recipient: string, message: string) {
    console.log(`Sending to ${recipient}: ${message}`);
  }
}
```

## Go deeper

Sometimes an adapter requires two-way translation (known as a "Two-Way Adapter"). A Two-Way Adapter implements both interfaces simultaneously, allowing it to appear as an OldSystem to new clients and as a NewSystem to legacy clients. This is especially useful during phased system migrations where old and new systems must run concurrently without breaking historical callers or premature cutovers.

## Watch out

- Avoid nesting multiple adapters inside each other (e.g., Adapter wrapping an Adapter).
- Watch for performance overhead if the adapter performs heavy JSON parsing or object transformation on every call.

## Remember

- Adapters add indirection and boilerplate code; avoid them when direct refactoring is possible.
- Use Adapters when dealing with third-party packages, frozen legacy APIs, or boundary migrations.
- Directly refactoring code you own keeps architectures lean and eliminates unnecessary wrappers.
