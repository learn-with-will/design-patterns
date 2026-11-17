---
slug: builder-intent
title: "Builder: Intent & Problem"
topic: creational-objects
kind: pattern
summary: "Builder separates the construction of a complex object from its representation, avoiding telescoping constructors."
tags:
  - creational
  - builder
  - construction
  - telescoping
related:
  - step-by-step-builder
  - fluent-builder-in-typescript
  - builder-director-and-variants
---

> **In one line:** Builder separates complex object assembly from its final representation, eliminating unreadable constructors.

## The idea

Constructing complex objects with numerous optional parameters, configurations, and nested dependencies quickly becomes unmanageable using standard constructors.

When a class has many configuration options, developers often resort to the "Telescoping Constructor" anti-pattern: creating multiple overloaded constructors, each taking progressively more parameters. Callers end up with unreadable invocations like `new User('Alice', null, true, null, 42, false)`.

The Gang of Four's **Builder** pattern solves this. Its official intent is: **"Separate the construction of a complex object from its representation so that the same construction process can create different representations."** Instead of constructing everything in a single massive call, a Builder object constructs the target object step-by-step through clear, self-describing methods.

| Problem in Direct Construction | Builder Pattern Solution |
|---|---|
| **Telescoping Constructors** | Discrete, named builder methods for each optional attribute |
| **Unreadable Booleans** | Clear self-documenting method calls like `builder.setSSL(true)` |
| **Partially Initialized State** | Object is returned only after validation in the final `build()` step |
| **Representation Invariance** | Different builders can create HTML, Text, or JSON from the same steps |

> **Note:** Builder is particularly valuable when constructing immutable objects. You configure the mutable builder step-by-step, then call `build()` to freeze and produce an immutable instance.

## See it

```typescript
// Anti-pattern: Telescoping constructor with unreadable boolean flags
// const query = new Query('users', 'SELECT', null, true, false, 10, 0);

// Builder pattern: Readable and self-documenting
interface UserProfile {
  username: string;
  email?: string;
  isAdmin?: boolean;
  theme?: string;
}

class UserProfileBuilder {
  private profile: UserProfile = { username: '' };

  setUsername(name: string) { this.profile.username = name; return this; }
  setEmail(email: string) { this.profile.email = email; return this; }
  setAdmin(isAdmin: boolean) { this.profile.isAdmin = isAdmin; return this; }
  
  build(): UserProfile {
    if (!this.profile.username) throw new Error('Username is required');
    return { ...this.profile };
  }
}
```

## Go deeper

Joshua Bloch in *Effective Java* popularized the static inner Builder pattern as the standard solution for constructors with more than four parameters. In TypeScript, object parameter destructuring (`constructor(config: UserConfig)`) provides a lightweight alternative, but Builder remains superior when construction involves staged steps, validation, or multiple output representations.

## Watch out

- Do not introduce a Builder for simple data classes with only two or three required properties.
- Always validate required fields inside the final build() method before returning the finished instance.

## Remember

- Builder separates complex step-by-step object construction from the resulting representation.
- It eliminates telescoping constructors and unreadable positional parameter lists.
- The final build() method enforces invariant validation before returning the assembled object.
