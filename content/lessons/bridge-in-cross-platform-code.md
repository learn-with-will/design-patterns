---
slug: bridge-in-cross-platform-code
title: "Cross-Platform Graphics & OS Bridges"
topic: structural-adapters
kind: technique
summary: "Use Bridge to share high-level rendering or windowing abstractions across distinct OS graphics backends."
tags:
  - structural
  - bridge
  - cross-platform
  - os
related:
  - bridge-intent
  - separating-abstraction-implementation
  - bridge-vs-adapter
---

> **In one line:** Bridge provides the architectural foundation for cross-platform UI frameworks and rendering engines.

## The idea

The classic application of the Bridge pattern is in cross-platform desktop toolkits, game engines, and graphics libraries. Frameworks like Flutter, Qt, and React Native must run identical UI widgets across divergent platforms: Windows, macOS, Linux, iOS, and Android.

If the framework coupled widget logic directly to platform APIs, maintaining widget state, event handling, and layout algorithms would require maintaining separate codebases for every operating system.

Using the Bridge pattern, high-level widgets (Buttons, TextInputs, Dialogs) form the Abstraction hierarchy. The low-level rendering engines (DirectX, Metal, Vulkan, WebGL) implement the Implementor interface. The shared widget code executes platform-agnostic layout math and delegates actual drawing across the bridge to whichever graphics backend is active.

| High-Level Abstraction (UI) | Bridge Contract | Low-Level Implementor (OS/GPU) |
|---|---|---|
| `Button`, `Checkbox` | `interface GraphicsContext` | `DirectXContext` (Windows) |
| `Dialog`, `Window` | `interface GraphicsContext` | `MetalContext` (macOS/iOS) |
| `Menu`, `Scrollbar` | `interface GraphicsContext` | `VulkanContext` (Linux/Android) |

> **Tip:** In testing environments, you can inject a `HeadlessRenderer` implementor across the bridge, enabling lightning-fast UI unit tests without spinning up a real graphical display server.

## See it

```typescript
interface GraphicsAPI {
  drawRect(x: number, y: number, w: number, h: number): void;
}

class MetalGraphics implements GraphicsAPI {
  drawRect(x: number, y: number, w: number, h: number) {
    console.log(`[Metal API] Rendered rect at ${x},${y}`);
  }
}

class WindowView {
  constructor(private graphics: GraphicsAPI) {}
  
  display() {
    // Cross-platform layout delegates to graphics bridge
    this.graphics.drawRect(0, 0, 800, 600);
  }
}

const macWindow = new WindowView(new MetalGraphics());
macWindow.display();
```

## Go deeper

Operating system drivers are another canonical implementation of Bridge. An operating system defines abstract device abstractions (e.g., standard POSIX file descriptor calls: `read`, `write`, `ioctl`). Hardware manufacturers write driver implementors that satisfy those contracts. User software operates on abstractions without knowing physical drive sector layouts.

## Watch out

- Do not design implementors that only work for one specific platform; keep primitives universally implementable.
- Watch out for leaky abstractions when platform-specific limitations (like touch gestures) leak across the bridge.

## Remember

- Bridge enables cross-platform engines to share UI logic across different OS graphics backends.
- High-level widgets remain agnostic of underlying GPU rendering libraries.
- Mock or headless implementors can be bridged during unit testing for rapid verification.
