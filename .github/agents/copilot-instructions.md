# hackfest01 Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-02-11

## Active Technologies

- TypeScript 4.9 + Next.js 16.1.6 + React 19.2.3 (1-copilot-dynamic-todo)
- Tailwind CSS 3.3 for styling
- GitHub Copilot SDK + MCP SDK for AI integration

## Project Structure

```text
src/dynamic-todo/
├── app/                 # Next.js App Router pages & API routes
├── components/          # React components (chrome/, chat/, todo/, ui/)
├── lib/                 # Core logic (copilot/, mcp/, storage/)
├── types/               # TypeScript interfaces
├── constants/           # Configuration values
└── data/users/          # Per-user state (gitignored)
```

## Commands

```bash
cd src/dynamic-todo
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run ESLint
npm test             # Run tests
```

## Code Style

TypeScript: Explicit types required, no `any`. See constitution.md.
React: Server Components by default, `'use client'` for interactive.
Naming: PascalCase components, camelCase functions/variables.

## Recent Changes

- 1-copilot-dynamic-todo: Dynamic Todo app with Copilot SDK + MCP integration

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
