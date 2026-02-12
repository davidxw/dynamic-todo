# Dynamic Todo

An AI-powered todo application with a dynamic UI that can be customized through natural language chat. This demo showcases GitHub Copilot SDK integration with the Model Context Protocol (MCP) for real-time UI manipulation.

## Features

- **Todo Management**: Create, complete, and delete tasks
- **AI-Powered Chat**: Modify the UI by chatting with GitHub Copilot
- **Dynamic UI**: Components can be added, removed, or modified in real-time
- **Theme Support**: Light and dark mode
- **Multi-User**: Switch between users with different UI configurations
- **Reset**: Restore UI to default state

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **AI Integration**: GitHub Copilot SDK
- **Protocol**: Model Context Protocol (MCP)

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+ or pnpm 8+
- GitHub Copilot subscription
- GitHub Copilot CLI installed (`copilot` in PATH)

## Setup

### 1. Install GitHub Copilot CLI

Follow the [Copilot CLI installation guide](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli) to install the CLI.

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Authentication

The SDK supports two authentication methods (in priority order):

#### Option A: Environment Variables (recommended for CI/CD, automation)

Set one of these environment variables (checked in priority order):

```env
# Recommended for explicit Copilot usage
COPILOT_GITHUB_TOKEN=ghp_your_token

# Or GitHub CLI compatible
GH_TOKEN=ghp_your_token

# Or GitHub Actions compatible
GITHUB_TOKEN=ghp_your_token
```

You can set these in a `.env.local` file:

```bash
# .env.local
COPILOT_GITHUB_TOKEN=ghp_your_personal_access_token
```

#### Option B: Signed-in User (recommended for development)

If no environment variables are set, the SDK automatically falls back to your Copilot CLI credentials:

```bash
copilot auth login
```

This stores credentials securely in your system keychain.

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Basic Todo Operations

1. Add tasks using the input field
2. Check the checkbox to mark tasks complete
3. Click delete to remove tasks
4. Toggle dark/light mode with the theme button

### AI-Powered UI Customization

1. Click the chat icon to open the chat panel
2. Describe UI changes in natural language:
   - "Add a priority dropdown to each task"
   - "Make the task list show due dates"
   - "Add a progress bar at the top"
3. Watch as the AI modifies the UI in real-time

### User Management

- Switch between users using the user dropdown
- Each user has their own UI configuration
- Click "Reset" to restore the default UI

## Development

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── chat/          # Chat endpoint
│   │   ├── mcp/           # MCP endpoints
│   │   ├── tasks/         # Task CRUD
│   │   ├── ui/            # UI state management
│   │   └── users/         # User management
│   └── page.tsx           # Main page
├── components/
│   ├── chat/              # Chat UI components
│   ├── chrome/            # App shell (header, layout)
│   ├── todo/              # Todo-specific components
│   └── ui/                # Shared UI primitives
├── lib/
│   ├── copilot/           # Copilot SDK client
│   ├── mcp/               # MCP server & tools
│   ├── services/          # Business logic
│   └── stores/            # Zustand stores
└── types/                 # TypeScript definitions
```

## License

MIT

