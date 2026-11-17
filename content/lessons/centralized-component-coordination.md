---
slug: centralized-component-coordination
title: "Coordinating UI Dialogs with a Mediator"
topic: behavioral-coordination
kind: technique
summary: "Route checkbox toggles, input changes, and submit button states through a central dialog mediator."
tags:
  - behavioral
  - mediator
  - ui
  - dialogs
  - typescript
related:
  - mediator-intent
  - mediator-vs-observer
  - observer-intent
---

> **In one line:** Coordinate complex UI form interactions cleanly by routing all component events through a dialog mediator.

## The idea

The canonical implementation of the Mediator pattern is in complex graphical user interface dialogs.

Consider an authentication dialog featuring a "Create Account" checkbox, an "Organization Name" input, a "Terms" checkbox, and a "Submit" button. The interactions are tightly coupled:
- Toggling "Create Account" hides or reveals the Organization input.
- The Submit button must remain disabled until both the username is valid and Terms are checked.
- Clearing the form resets all components to defaults.

Instead of writing this validation logic inside individual button and checkbox event listeners, all components notify the `AuthDialogMediator`. The mediator reads component states, applies business rules, and updates UI visibility centrally.

| Component Event | What Colleague Does | What Mediator Orchestrates |
|---|---|---|
| **Checkbox Checked** | Calls `mediator.notify(this, 'check')` | Enables dependent inputs; validates form |
| **Input Typed** | Calls `mediator.notify(this, 'change')` | Checks regex validity; updates submit button |
| **Submit Clicked** | Calls `mediator.notify(this, 'submit')` | Displays spinner; dispatches network request |

> **Tip:** Colleague components should remain completely dumb: they emit events like "user checked box" or "value changed", leaving all decision-making to the mediator.

## See it

```typescript
class Checkbox extends BaseComponent {
  public checked = false;
  toggle() {
    this.checked = !this.checked;
    this.mediator?.notify(this, 'toggle');
  }
}

class SubmitButton extends BaseComponent {
  public enabled = false;
  setEnabled(val: boolean) { this.enabled = val; }
}

class FormMediator implements Mediator {
  constructor(private terms: Checkbox, private btn: SubmitButton) {
    this.terms.setMediator(this);
    this.btn.setMediator(this);
  }

  notify(sender: object, event: string): void {
    if (sender === this.terms && event === 'toggle') {
      this.btn.setEnabled(this.terms.checked);
    }
  }
}
```

## Go deeper

Modern frontend frameworks (React, Vue, Svelte) often use state management stores (like Redux, Zustand, or Pinia) that act as modern architectural mediators. Components dispatch actions to the central store, and the store coordinates state updates and derived notifications, preserving the hub-and-spoke principle across entire single-page applications.

## Watch out

- Avoid hardcoding concrete colleague types in the mediator if abstract interfaces allow reuse.
- Watch out for circular notification loops between mediator updates and colleague event triggers.

## Remember

- UI form dialogs are the classic use case for the Mediator pattern.
- Colleagues remain dumb components that notify the mediator of user actions.
- The mediator encapsulates all interaction rules, validation state, and cross-widget coordination.
