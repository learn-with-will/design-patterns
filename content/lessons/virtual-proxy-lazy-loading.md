---
slug: virtual-proxy-lazy-loading
title: "Virtual Proxies & Lazy Loading"
topic: structural-proxies
kind: technique
summary: "Defer expensive object instantiation and disk reads until a client invokes a method on the virtual proxy."
tags:
  - structural
  - proxy
  - lazy-loading
  - performance
related:
  - proxy-intent
  - protection-and-caching-proxies
  - proxy-vs-decorator-vs-adapter
---

> **In one line:** Virtual Proxies defer expensive object instantiation and I/O until the object is actually accessed.

## The idea

A **Virtual Proxy** is one of the most widely used variations of the Proxy pattern. It optimizes system startup and memory consumption through **lazy initialization**.

Imagine an application dashboard that displays 100 documents, each containing high-resolution images or large datasets. Loading and rendering all 100 images at application startup consumes massive RAM and slows down boot times, even though the user might only scroll to view the first 2 images.

A Virtual Proxy solves this by pretending to be the real image. When instantiated, the proxy does not load the image bytes. It loads lightweight metadata (such as image dimensions). Only when the UI actually invokes `image.render()` does the Virtual Proxy instantiate the real image object, load the bytes from disk, and forward the call.

| Phase | Client Action | Real Subject State | Virtual Proxy Action |
|---|---|---|---|
| **Startup** | Creates image proxies | Not in memory (0 MB) | Instantiates lightweight placeholder |
| **Idle** | Document is scrolled | Not in memory (0 MB) | Holds file path only |
| **First Render** | Calls `proxy.render()` | **Loaded from disk** | Instantiates RealSubject on demand; delegates |
| **Subsequent Calls** | Calls `proxy.render()` | Already in memory | Reuses existing RealSubject instance |

> **Tip:** Virtual proxies are self-caching: once the RealSubject is instantiated on the first call, the proxy stores the reference and delegates subsequent calls immediately without re-instantiating.

## See it

```typescript
interface Image { display(): void; }

class HighResImage implements Image {
  constructor(private filename: string) {
    console.log(`Loading heavy image from disk: ${this.filename}`);
  }
  display() { console.log(`Rendering ${this.filename} on screen`); }
}

class LazyImageProxy implements Image {
  private realImage: HighResImage | null = null;
  constructor(private filename: string) {}

  display(): void {
    if (!this.realImage) {
      this.realImage = new HighResImage(this.filename);
    }
    this.realImage.display();
  }
}

const img = new LazyImageProxy('dataset_scan.raw'); // Fast! No disk read yet
img.display(); // Disk read occurs now on demand!
```

## Go deeper

Modern ORMs (like Hibernate, Entity Framework, and TypeORM) rely extensively on Virtual Proxies for lazy-loading relationships. When you load a `User` entity, its `orders` property is not a raw array from the database; it is a virtual proxy. When your code accesses `user.orders.length`, the proxy intercepts the property access and queries the database on the fly.

## Watch out

- Watch out for the N+1 query problem when virtual proxies execute lazy database queries inside loops.
- Be careful when serializing proxy objects to JSON; accessing properties during serialization can trigger unwanted lazy loads.

## Remember

- Virtual Proxies defer heavyweight object allocation until a method is actually invoked.
- They dramatically improve application startup speed and conserve memory for unaccessed resources.
- The proxy creates the RealSubject on demand and caches the reference for subsequent calls.
