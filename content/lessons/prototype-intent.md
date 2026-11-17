---
slug: prototype-intent
title: "Prototype: Intent & Cloning"
topic: creational-objects
kind: pattern
summary: "Prototype creates new objects by copying an existing instance rather than instantiating classes directly."
tags:
  - creational
  - prototype
  - cloning
  - performance
related:
  - shallow-vs-deep-cloning
  - prototype-registry
  - prototype-vs-js-prototypes
---

> **In one line:** Prototype creates new objects by cloning an existing configured instance rather than calling new.

## The idea

In certain systems, instantiating an object from scratch is computationally expensive or requires complex external database queries and network handshakes. 

For example, initializing a graphic document with hundreds of pre-configured shapes, colors, and textures takes significant CPU cycles. If you need 50 similar shapes, running the full instantiation process for each one is wasteful.

The Gang of Four's **Prototype** pattern solves this. Its official intent is: **"Specify the kinds of objects to create using a prototypical instance, and create new objects by copying this prototype."** Instead of calling `new` and re-running expensive initialization, you take an existing prototype object and invoke its `clone()` method, customizing only the differences on the duplicate. This optimizes memory allocation and accelerates dynamic object generation.

| Instantiation via new | Instantiation via Prototype (clone) |
|---|---|
| Re-executes full constructor logic | Bypasses constructor; copies internal state directly |
| Client must know concrete class name | Client only needs a reference to a Prototype interface |
| Requires re-fetching baseline configuration | Inherits baseline configuration from the prototype |
| Slow for heavyweight objects | Fast memory duplication of pre-warmed instances |

> **Note:** Prototype decouples clients from concrete classes. If an object implements `interface Cloneable { clone(): this; }`, a client can clone it without ever knowing its specific concrete class.

## See it

```typescript
interface Prototype<T> {
  clone(): T;
}

class Circle implements Prototype<Circle> {
  constructor(public radius: number, public color: string) {}

  clone(): Circle {
    // Return a new instance initialized with identical state
    return new Circle(this.radius, this.color);
  }
}

const redCircle = new Circle(10, 'red');
const clonedCircle = redCircle.clone();
clonedCircle.color = 'blue'; // Customize the clone
console.log(`Cloned circle: radius=${clonedCircle.radius}, color=${clonedCircle.color}`);
```

## Go deeper

Prototype is particularly prevalent in game development and graphics engines. Spawning 1,000 enemy NPCs or forest trees with identical 3D meshes, particle effects, and sound profiles is implemented by keeping one prototype template in memory and cloning it into the game scene, altering only position coordinates. This pattern circumvents complex factory hierarchies when object variants differ only in their initial internal state attributes.

## Watch out

- Do not use Prototype for lightweight data transfer objects that are trivial to instantiate with new.
- Be extremely careful regarding whether the clone method performs a shallow or deep copy.

## Remember

- Prototype creates new objects by cloning pre-configured prototypical instances.
- It avoids expensive constructor overhead and complex initialization routines.
- Clients can duplicate objects polymorphically without coupling to concrete classes.
