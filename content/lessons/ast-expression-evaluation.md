---
slug: ast-expression-evaluation
title: "Building AST Evaluators in TypeScript"
topic: behavioral-traversal
kind: technique
summary: "Combine terminal expressions and non-terminal binary operators into abstract syntax trees evaluated against context."
tags:
  - behavioral
  - interpreter
  - ast
  - typescript
  - evaluation
related:
  - interpreter-intent
  - visitor-intent
  - composite-recursive-operations
---

> **In one line:** Build and evaluate boolean or mathematical Abstract Syntax Trees in TypeScript using Context dictionaries.

## The idea

To implement an AST evaluator in TypeScript, define a shared `Expression` interface with an `evaluate(context: Context): T` method.

The **Context** is a dictionary or Map that stores variable resolutions, user session properties, or environment variables.

When building logical filter engines (e.g., query builders or authorization rules), boolean expressions form the non-terminal nodes:
- `EqualsExpression(property, literal)`
- `AndExpression(expr1, expr2)`
- `OrExpression(expr1, expr2)`

By assembling these nodes into a tree structure, complex user-defined business rules can be evaluated dynamically against varying runtime data records. This empowers non-technical administrators to configure business formulas, discount conditions, or access-control criteria dynamically without deploying new application code.

| Expression Node | Type | Evaluation Logic |
|---|---|---|
| `Variable(key)` | Terminal | Look up key in `context.get(key)` |
| `Literal(val)` | Terminal | Return literal value directly |
| `Equals(a, b)` | Non-terminal | `a.evaluate(ctx) === b.evaluate(ctx)` |
| `And(a, b)` | Non-terminal | `a.evaluate(ctx) && b.evaluate(ctx)` |

> **Tip:** You can combine Interpreter with the **Visitor pattern** to separate evaluation from other operations, such as pretty-printing the AST back to string format or optimizing sub-trees.

## See it

```typescript
interface BooleanExpr {
  evaluate(context: Record<string, unknown>): boolean;
}

class VarExpr implements BooleanExpr {
  constructor(private name: string) {}
  evaluate(ctx: Record<string, unknown>) { return Boolean(ctx[this.name]); }
}

class AndExpr implements BooleanExpr {
  constructor(private left: BooleanExpr, private right: BooleanExpr) {}
  evaluate(ctx: Record<string, unknown>): boolean {
    return this.left.evaluate(ctx) && this.right.evaluate(ctx);
  }
}

// Rule: isAdmin AND isVerified
const rule = new AndExpr(new VarExpr('isAdmin'), new VarExpr('isVerified'));
console.log(rule.evaluate({ isAdmin: true, isVerified: true })); // true
console.log(rule.evaluate({ isAdmin: true, isVerified: false })); // false
```

## Go deeper

Modern authorization engines (such as Open Policy Agent or AWS IAM policies) evaluate policy rules using AST evaluation concepts. Policies are authored in JSON or Rego and parsed into expression trees that evaluate whether an API request is permitted based on user attributes, resource tags, and environment variables. The tree-based evaluation model provides high transparency and auditable security evaluation across enterprise microservice perimeters.

## Watch out

- Watch for runtime errors when an expression references a variable missing from the context.
- Beware of performance overhead when evaluating deep expression trees in tight loops over millions of rows.

## Remember

- Abstract Syntax Trees represent nested expressions as composable class structures.
- The evaluate() method traverses the tree recursively, passing the context down to all nodes.
- Boolean and mathematical evaluators provide powerful engines for user-defined business rules.
