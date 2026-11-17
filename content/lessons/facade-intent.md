---
slug: facade-intent
title: "Facade: Intent & Subsystem Entry Points"
topic: structural-proxies
kind: pattern
summary: "Facade provides a unified, higher-level interface to a set of interfaces in a subsystem, making it easier to use."
tags:
  - structural
  - facade
  - subsystem
  - simplification
related:
  - subsystem-simplification
  - facade-vs-adapter-vs-mediator
  - proxy-intent
---

> **In one line:** Facade provides a simple, unified interface to a complex subsystem of interacting classes.

## The idea

Complex software systems inevitably accumulate sophisticated subsystems: audio/video decoders, 3D graphics pipelines, compiler AST parsers, or multipart cloud billing engines.

These subsystems consist of dozens of fine-grained classes that must be instantiated in a specific order, configured with intricate parameters, and coordinated carefully. Forcing client code to interact with all these low-level classes creates tight coupling: clients become entangled in subsystem implementation details.

The Gang of Four's **Facade** pattern addresses this. Its official intent is: **"Provide a unified interface to a set of interfaces in a subsystem. Facade defines a higher-level interface that makes the subsystem easier to use."** A Facade provides a single, convenient entry point that orchestrates the underlying subsystem, offering straightforward methods for 90% of common use cases.

| Aspect | Direct Subsystem Interaction | Facade Pattern Interaction |
|---|---|---|
| **Client Coupling** | Coupled to 10+ internal subsystem classes | Coupled solely to the single Facade class |
| **Complexity** | Client manages initialization sequences | Facade encapsulates orchestration |
| **Direct Access** | Required | Still available for advanced power users |
| **API Surface** | Large, detailed, and cognitive heavy | Minimal, coarse-grained, and intuitive |

> **Note:** A Facade simplifies a subsystem, but does not conceal it. Advanced clients that genuinely require fine-grained low-level control can bypass the facade and interact with subsystem classes directly.

## See it

```typescript
// Complex low-level subsystem classes
class VideoFile { constructor(public filename: string) {} }
class CodecFactory { static extract(file: VideoFile) { return 'raw_stream'; } }
class BitrateCompressor { static compress(stream: string) { return 'compressed'; } }
class AudioMixer { static fixAudio(stream: string) { return 'mastered_audio'; } }

// Facade provides one-line convenience for clients
class VideoConverterFacade {
  convertVideo(filename: string, format: string): string {
    const file = new VideoFile(filename);
    const source = CodecFactory.extract(file);
    const compressed = BitrateCompressor.compress(source);
    return AudioMixer.fixAudio(compressed);
  }
}

const converter = new VideoConverterFacade();
converter.convertVideo('vacation.mov', 'mp4');
```

## Go deeper

Facade promotes the Principle of Least Knowledge (the Law of Demeter): a component should only talk to its immediate friends. By having clients interact exclusively with the Facade rather than dozens of subsystem objects, the boundaries between architectural layers remain clean and decoupled.

## Watch out

- Avoid letting a Facade become an omniscient "God Object" containing domain business logic.
- Do not restrict access completely if power users occasionally require advanced subsystem configurations.

## Remember

- Facade offers a high-level, simplified entry point to a complex subsystem.
- It drastically reduces coupling between client code and internal subsystem classes.
- Low-level subsystem classes remain accessible for advanced consumers who require fine control.
