---
slug: stacking-multiple-decorators
title: "Stacking and Composing Decorators"
topic: structural-composition
kind: technique
summary: "Chain multiple decorators around a core component to combine logging, caching, and encryption transparently."
tags:
  - structural
  - decorator
  - chaining
  - composition
related:
  - decorator-intent
  - wrapping-behavior-dynamically
  - decorator-vs-inheritance
---

> **In one line:** Stack multiple decorators in arbitrary orders to combine orthogonal capabilities like encryption, compression, and caching.

## The idea

The true power of the Decorator pattern emerges when multiple decorators are composed together in layers.

Because every decorator satisfies the same interface, decorators can wrap other decorators indefinitely. This allows developers to assemble rich, custom behaviors dynamically at runtime based on user permissions, configuration flags, or environment variables.

For example, a data persistence pipeline can start with a basic `FileStorage` component, wrap it with an `EncryptionDecorator`, wrap that with a `CompressionDecorator`, and finally wrap the outside with a `MetricsLoggingDecorator`. The order of wrapping determines the execution sequence during reads and writes.

| Layer | Execution Role on Write | Execution Role on Read |
|---|---|---|
| **Outer: MetricsDecorator** | Measures write elapsed time | Measures read elapsed time |
| **Middle: CompressionDecorator** | Compresses raw data buffer | Decompresses buffer |
| **Inner: EncryptionDecorator** | Encrypts compressed payload | Decrypts encrypted payload |
| **Core: FileStorage** | Writes final bytes to disk | Reads raw bytes from disk |

> **Tip:** The order in which decorators are stacked matters! Encrypting and then compressing produces poor compression ratios; compressing first and then encrypting is significantly more efficient.

## See it

```typescript
interface MessageNotifier { send(text: string): void; }

class BaseNotifier implements MessageNotifier {
  send(text: string) { console.log(`Base notification: ${text}`); }
}

class SlackDecorator implements MessageNotifier {
  constructor(private wrappee: MessageNotifier) {}
  send(text: string) {
    this.wrappee.send(text);
    console.log(`-> Posted to Slack: ${text}`);
  }
}

class SmsDecorator implements MessageNotifier {
  constructor(private wrappee: MessageNotifier) {}
  send(text: string) {
    this.wrappee.send(text);
    console.log(`-> Sent SMS text: ${text}`);
  }
}

const notifier = new SmsDecorator(new SlackDecorator(new BaseNotifier()));
notifier.send('Deployment succeeded');
```

## Go deeper

Stacking decorators is a runtime application of the Open/Closed Principle. You can introduce new notification channels (e.g., `DiscordDecorator`, `WhatsAppDecorator`) without editing existing notifier classes. Consumers compose whatever communication channels they desire simply by chaining constructors.

## Watch out

- Beware of ordering dependencies between stacked decorators; document expected composition orders.
- Do not remove decorators from the middle of an active stack at runtime; reassemble a new stack instead.

## Remember

- Multiple decorators can be nested around a core component in arbitrary combinations.
- The nesting order determines the execution sequence of pre-processing and post-processing steps.
- Stacking decorators achieves rich behavioral composition without exponential subclass proliferation.
