---
id: lesson-10
slug: composite
title: "Composite"
level: intermediate
order: 10
duration: 16
tags:
  - structural
  - composite
  - tree
  - recursion
  - gof
summary: "The Composite pattern — arrange objects into tree structures representing part-whole hierarchies, and give leaves and containers a shared interface so client code can treat a single object and a whole group of objects exactly the same way."
---

# Learning Objectives

By the end of this lesson you will be able to:

- State the **intent** of the Composite pattern.
- Model a **part-whole tree** with a shared interface in TypeScript.
- Explain **uniform treatment** of leaves and composites.
- Recognize where Composite fits (and where a tree is overkill).

# Why It Matters

Trees are everywhere: files inside folders inside folders, UI elements inside panels, sub-tasks inside
tasks. Without a pattern, client code is riddled with "is this a single thing or a group?" checks.
**Composite** removes those checks by giving both the single thing (**leaf**) and the group
(**composite**) the **same interface**, so you can call one method on any node and let the tree sort
itself out.

# Concept Explanation

### Intent

> **Compose objects into tree structures to represent part-whole hierarchies. Composite lets clients
> treat individual objects and compositions of objects uniformly.** — Gang of Four

### The participants

- **Component** — the shared interface for everything in the tree (`FileSystemNode` with `size()`).
- **Leaf** — a node with no children (`FileItem`).
- **Composite** — a node that holds children and implements the operation by **delegating to them**
  (`Folder`).
- **Client** — works through the Component interface, never asking "leaf or composite?".

```text
        Component (size)
            △
     ┌──────┴───────┐
   FileItem       Folder ──children──▶ Component[]
   (leaf)         (composite)
```

### In TypeScript

```typescript
interface FileSystemNode {
  readonly name: string;
  size(): number; // bytes
}

class FileItem implements FileSystemNode {
  constructor(public readonly name: string, private bytes: number) {}
  size() { return this.bytes; }
}

class Folder implements FileSystemNode {
  private children: FileSystemNode[] = [];
  constructor(public readonly name: string) {}
  add(node: FileSystemNode) { this.children.push(node); return this; }
  // A composite implements the operation by asking its children — recursion.
  size(): number {
    return this.children.reduce((total, child) => total + child.size(), 0);
  }
}

const root = new Folder("root")
  .add(new FileItem("a.txt", 100))
  .add(new Folder("images").add(new FileItem("logo.png", 900)));

root.size(); // 1000 — the client just calls size(); the tree adds itself up.
```

The client calls `size()` on the root without knowing or caring how deep the tree goes.

### Uniform treatment

The power of Composite is that `child.size()` works whether `child` is a file or a folder. The
composite's implementation **recurses** through its children, each of which is again a Component. One
interface, any depth.

### Consequences

- **Good:** clients ignore the leaf-vs-composite distinction; adding new node types is easy; naturally
  fits recursive structures.
- **Cost:** the shared interface can become **too general** — some operations make sense only on
  composites (`add`/`remove`) or only on leaves, forcing awkward choices about where to put them.

# Key Terminology

- **Component** — the common interface of all tree nodes.
- **Leaf** — a node with no children.
- **Composite** — a node that contains children and delegates operations to them.
- **Part-whole hierarchy** — a structure where wholes are made of parts that may themselves be wholes.

# Options and Trade-offs

| Concern | Composite | Ad-hoc type checks | How to choose |
| ------- | --------- | ------------------ | ------------- |
| Leaf vs group handling | One interface, no checks | `if (isFolder) …` everywhere | Composite when the structure is genuinely a tree. |
| `add`/`remove` placement | On composite (or on component, with trade-offs) | N/A | Put child-management on the composite for type safety. |
| Simplicity | A small hierarchy | A flat list | Skip Composite if there's no real nesting. |

# Worked Example

The same `size()` call handles a flat file and a deep folder tree:

```typescript
const flat = new FileItem("note.txt", 42);
const deep = new Folder("a").add(new Folder("b").add(new FileItem("c.txt", 8)));

flat.size(); // 42
deep.size(); // 8 — recursion walks a → b → c
```

Client code that sums sizes doesn't branch on node type at all.

# Real World Analogy

Composite is a **company org chart**. To count everyone under a manager, you ask each direct report for
*their* headcount; an individual contributor reports 1, a manager reports the sum of their team. You
ask the same question of everyone — "how many under you?" — and the structure answers itself, however
many layers deep.

# Examples

## Example 1 — Basic: summing a tree

`root.size()` returns 1000 by recursing into the `images` folder and its file. The client made one
call; the composite did the walking.

**Why this works:** each composite implements the operation by delegating to its children.

## Example 2 — Real-world: UI component trees

A UI panel contains buttons and other panels; calling `render()` on the root renders the whole tree.
Frameworks lean on this shape so a screen is just a tree of components with a shared interface.

**Why this works:** uniform treatment lets a container and a control be handled by the same code.

## Example 3 — Pitfall: an over-general interface

Putting `add(child)` on the shared `Component` interface means **leaves** must implement it too — often
by throwing. That's a leaky compromise the Composite pattern is known for.

**Why this bites:** child-management only makes sense on composites; forcing it onto leaves breaks the
Liskov substitution promise.

# Common Mistakes

- **Using Composite without a real tree.** A flat collection doesn't need it.
- **Cramming `add`/`remove` onto leaves.** Decide deliberately whether child-management lives on the
  Component or only the Composite.
- **Deep recursion without limits** on untrusted input can overflow the stack.

# Best Practices

- Keep the **Component interface** focused on operations meaningful to *every* node.
- Prefer putting **child-management on the Composite** for type safety.
- Let composites implement operations by **delegating to children** (recursion).

# Summary

- **Composite** arranges objects into **part-whole trees** and gives leaves and composites a **shared
  interface**.
- Clients enjoy **uniform treatment** — one call works on a single node or an entire subtree.
- Composites implement operations by **recursing** into their children.
- The main tension is where to put operations (like `add`) that only apply to some node types.

# Flash Cards

Q: What is the intent of the Composite pattern?
A: Compose objects into tree structures for part-whole hierarchies and let clients treat individual objects and compositions uniformly.

Q: What are the three roles in Composite?
A: Component (the shared interface), Leaf (no children), and Composite (holds children and delegates operations to them).

Q: What does "uniform treatment" mean here?
A: Client code calls the same operation on a leaf or a composite without checking which it is; the tree handles the difference.

Q: How does a composite usually implement an operation like size()?
A: By recursing — delegating to each child and combining the results (e.g. summing children's sizes).

Q: What is the well-known tension in Composite's interface design?
A: Whether to put child-management methods (add/remove) on the shared Component (forcing leaves to implement them, often by throwing) or only on the Composite.

Q: When is Composite the wrong choice?
A: When the data isn't really a tree — a flat collection gains nothing from the pattern.

# Exercises

### Easy
Identify the Component, Leaf, and Composite in the file-system example, and explain how `Folder.size()`
uses recursion.

### Medium
Add a `count(): number` operation that returns the number of files (leaves) under any node. Implement it
on both `FileItem` and `Folder`, and test it on a nested tree.

### Challenging
Design a menu system where a `MenuItem` is a leaf and a `Menu` is a composite. Decide whether `add`
lives on the shared interface or only on `Menu`, and justify the trade-off in terms of the Liskov
Substitution Principle.

# Further Reading

- Gamma et al. — *Design Patterns*, "Composite".
- Refactoring.Guru — *Composite*: <https://refactoring.guru/design-patterns/composite>
- Refactoring.Guru — *Composite in TypeScript*: <https://refactoring.guru/design-patterns/composite/typescript/example>
