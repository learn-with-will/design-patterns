---
slug: interpreter-intent
title: "Interpreter: Intent & Domain Grammars"
topic: behavioral-traversal
kind: pattern
summary: "Given a language, define a representation for its grammar along with an interpreter to evaluate sentences."
tags:
  - behavioral
  - interpreter
  - grammar
  - ast
  - dsl
related:
  - ast-expression-evaluation
  - visitor-intent
  - composite-intent
---

> **In one line:** Interpreter defines a class-based grammar representation and an interpreter engine to evaluate domain sentences.

## The idea

In certain software domains, problems recur so consistently in a specific problem space that it is advantageous to express them in a simple Domain-Specific Language (DSL). Examples include SQL queries, regular expressions, calculation formula engines (Excel formulas), and permission expression rules (`role = 'admin' AND region = 'US'`).

The Gang of Four's **Interpreter** pattern addresses this. Its official intent is: **"Given a language, define a representation for its grammar along with an interpreter that uses the representation to interpret sentences in the language."**

In Interpreter, every grammar rule is represented as a class:
- **Terminal Expressions**: Atomic leaf nodes (numbers, variable names, literals).
- **Non-Terminal Expressions**: Operations that combine sub-expressions (Add, Subtract, AND, OR).
Sentences are parsed into an Abstract Syntax Tree (AST) of composite expression objects, and calling `evaluate(context)` recursively computes the result.

| Participant | Role | Example |
|---|---|---|
| **AbstractExpression** | Declares the interpret/evaluate contract | `interface Expression { evaluate(ctx): number; }` |
| **TerminalExpression** | Leaf expression containing literals | `NumberExpression(5)`, `VariableExpression('x')` |
| **NonterminalExpression** | Composite operator combining sub-rules | `AddExpression(left, right)`, `AndExpression(a, b)` |
| **Context** | Stores global runtime state/variables | `Map { 'x' => 10, 'taxRate' => 0.08 }` |

> **Note:** Notice that the Abstract Syntax Tree created by Interpreter is structurally identical to the **Composite pattern**. Interpreter is effectively Composite applied to grammar rules.

## See it

```typescript
// Expression contract
interface Expression {
  evaluate(context: Map<string, number>): number;
}

// Terminal expression
class NumberLiteral implements Expression {
  constructor(private value: number) {}
  evaluate(): number { return this.value; }
}

// Non-terminal expression
class AddExpression implements Expression {
  constructor(private left: Expression, private right: Expression) {}
  evaluate(ctx: Map<string, number>): number {
    return this.left.evaluate(ctx) + this.right.evaluate(ctx);
  }
}

// AST for: (5 + 10)
const tree = new AddExpression(new NumberLiteral(5), new NumberLiteral(10));
console.log(tree.evaluate(new Map())); // 15
```

## Go deeper

While Interpreter is elegant for simple, tiny domain-specific languages, the Gang of Four explicitly cautioned that it does not scale to complex grammars (like full programming languages). For complex languages with hundreds of grammar rules, class hierarchies become unmanageable. Full compiler tools (parser generators like ANTLR or Chevrotain) are preferred for large grammars.

## Watch out

- Do not use Interpreter for complex grammars; use dedicated parser generators and AST libraries.
- Ensure that the Context stores all necessary variable bindings before evaluating expressions.

## Remember

- Interpreter models grammar rules as a hierarchy of composite expression classes.
- Terminal expressions represent literals; non-terminal expressions represent operators.
- Expressions evaluate recursively against a shared runtime Context containing variable bindings.
