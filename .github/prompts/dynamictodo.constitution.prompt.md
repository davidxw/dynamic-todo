---
agent: speckit.constitution
name: dynamictodo-constitution
description: Generate a constraints-level constitution for the Dynamic Todo app
---

Create principles focused on maintainability, readability and a
user-centric experience. Keep them durable and at the constraints level.

# Code guidelines

This is a **demonstration and teaching codebase**. Prioritize:

1. **Clear, readable code** over clever optimizations
2. **Explicit types** - always use TypeScript types, avoid `any`
3. **Descriptive names** - functions and variables should be self-documenting
4. **Comments for "why"** - explain reasoning, not what the code does
5. **Small functions** - each function should do one thing well
6. Prefer .env file for settings, always add samples to .env.sample file

### Avoid

- Complex abstractions that obscure the flow
- Deeply nested callbacks or conditionals
- Magic numbers or strings without constants
- Overly DRY code that sacrifices readability
- Ensure no secrets are stored in repo, keep gitignore file up to date