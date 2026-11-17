---
slug: mediator-intent
title: "Mediator: Intent & Decoupled Communication"
topic: behavioral-coordination
kind: pattern
summary: "Define an object that encapsulates how a set of objects interact, preventing them from referring to each other explicitly."
tags:
  - behavioral
  - mediator
  - decoupling
  - coordination
related:
  - centralized-component-coordination
  - mediator-vs-observer
  - facade-vs-adapter-vs-mediator
---

> **In one line:** Mediator centralizes complex communication between collaborating objects, preventing tight many-to-many coupling.

## The idea

In complex applications—such as intricate user interfaces with dozens of interconnected form fields, buttons, and validation banners—objects frequently need to react to changes in other objects.

If components reference each other directly, you get a tangled "spiderweb" of dependencies: Button A directly references Checkbox B, which calls Textbox C, which updates Label D. Every component is coupled to multiple other components, making individual UI elements impossible to reuse or test in isolation.

The Gang of Four's **Mediator** pattern untangles this web. Its official intent is: **"Define an object that encapsulates how a set of objects interact. Mediator promotes loose coupling by keeping objects from referring to each other explicitly, and it lets you vary their interaction independently."** Instead of communicating directly, components (colleagues) notify a central Mediator, which orchestrates all secondary interactions.

| Without Mediator (Many-to-Many Spiderweb) | With Mediator (Hub-and-Spoke Architecture) |
|---|---|
| Every component holds references to 5 other components | Components hold a reference **only** to the Mediator |
| Modifying one component breaks 4 other components | Components are completely decoupled from each other |
| Cannot reuse a component without bringing the whole web | Components are reusable in isolation |
| N*(N-1)/2 chaotic dependency connections | Exactly N clean connections to the central hub |

> **Note:** The classic real-world analogy is an air traffic control tower. Planes (colleagues) do not communicate directly with each other; they communicate exclusively with the tower (mediator), which coordinates safe flight paths.

## See it

```typescript
interface Mediator {
  notify(sender: object, event: string): void;
}

class BaseComponent {
  constructor(protected mediator: Mediator | null = null) {}
  setMediator(m: Mediator) { this.mediator = m; }
}

class ButtonColleague extends BaseComponent {
  click() { this.mediator?.notify(this, 'click'); }
}

class DialogMediator implements Mediator {
  constructor(public button: ButtonColleague) {
    this.button.setMediator(this);
  }

  notify(sender: object, event: string): void {
    if (sender === this.button && event === 'click') {
      console.log('Mediator coordinating save operation');
    }
  }
}
```

## Go deeper

Mediator transforms a chaotic distributed system into a clean hub-and-spoke architecture. When domain rules dictate complex cross-component workflows, centralizing that choreography in a Mediator makes the workflow explicit, readable, and easy to modify without touching UI widget code.

## Watch out

- Do not let the Mediator become an unmanageable "God Object" containing thousands of lines of unrelated logic.
- Ensure colleague objects notify the mediator of what happened, rather than commanding the mediator what to do.

## Remember

- Mediator centralizes multi-object communication into a single hub-and-spoke coordinator.
- Colleague objects only know about the mediator, never about other colleagues directly.
- It eliminates messy many-to-many dependencies and makes individual components reusable.
