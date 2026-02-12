# Quickstart: Copilot Dynamic Todo

**Feature**: 1-copilot-dynamic-todo  
**Date**: 2026-02-11

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+ or pnpm 8+
- GitHub account with Copilot access
- GitHub Personal Access Token with `copilot` scope

## Setup

### 1. Install Dependencies

```bash
cd src/dynamic-todo
npm install
```

### 2. Configure Environment

Copy the sample environment file and fill in your values:

```bash
cp .env.sample .env
```

Required variables:
```env
# GitHub Copilot SDK authentication
GITHUB_TOKEN=ghp_your_personal_access_token

# Optional: Override default port
PORT=3000
```

### 3. Initialize User Data

The first run will create default user directories:

```bash
npm run init-users
```

This creates:
- `data/users/default/` - Template state (used for reset)
- `data/users/alice/` - Sample customized user
- `data/users/bob/` - Sample customized user

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Walkthrough

### Story 1: Use the Todo App (P1)

1. Open the app - you see the sample Todo interface
2. Add a task by typing in the input field and pressing Enter
3. Click the checkbox to mark a task complete
4. Click the delete icon to remove a task
5. Toggle dark/light mode using the theme button in the header

### Story 2: Customize via Chat (P2)

1. Click the chat icon in the header to open the chat panel
2. Type: "Add a priority dropdown to each task"
3. Watch the reasoning steps appear as the AI processes your request
4. See the tool calls being made to modify the UI
5. View the change summary once complete
6. Verify the Todo UI now shows priority dropdowns

### Story 3: Reset to Original (P3)

1. After making customizations, click the "Reset" button in the header
2. Confirm the reset action
3. The Todo UI returns to its original sample state

### Story 4: Switch Users (P4)

1. Click the user switcher dropdown in the header
2. Select "Alice" from the list
3. The UI updates to show Alice's saved customizations
4. Switch to "Bob" to see a different customization state
5. Switch back to "Default" for the original UI

### Story 5: Explore Components (P5)

1. Open the chat panel
2. Ask: "What components can I use?"
3. The MCP server returns a list of available UI components
4. Try asking: "Show me the props for TaskItem"

## Project Structure

```
src/dynamic-todo/
├── app/                 # Next.js pages and API routes
├── components/          # React components
│   ├── chrome/          # App header, user switcher, reset button
│   ├── chat/            # Chat interface components
│   ├── todo/            # Todo app components
│   └── ui/              # Shared UI primitives
├── lib/                 # Core logic
│   ├── copilot/         # Copilot SDK integration
│   ├── mcp/             # MCP server implementation
│   └── storage/         # File-based user state
├── types/               # TypeScript interfaces
├── constants/           # Configuration values
└── data/users/          # Per-user state files (gitignored)
```

## Common Tasks

### Add a New UI Component

1. Create component in `components/ui/` or `components/todo/`
2. Register in `lib/mcp/components.ts`:
   ```typescript
   registerComponent({
     name: 'MyComponent',
     description: 'What it does',
     category: 'display',
     props: [...],
     canHaveChildren: false
   });
   ```
3. Export from `components/ui/index.ts`

### Modify the Default Todo UI

Edit `data/users/default/state.json` to change the initial UI tree.

### Add API Capabilities

The Todo API has intentionally more capabilities than the default UI exposes. To add features:

1. Check `contracts/todo-api.yaml` for available endpoints
2. Create UI components that call those endpoints
3. Register components for MCP discovery

## Troubleshooting

### "GITHUB_TOKEN not configured"
Ensure `.env` file exists with a valid `GITHUB_TOKEN`.

### "Component not found: X"
The component name must match a registered component in `lib/mcp/components.ts`.

### UI changes don't persist
Check that `data/users/{userId}/` directory is writable.

### MCP connection failed
Restart the dev server. MCP requires a fresh connection on startup.
