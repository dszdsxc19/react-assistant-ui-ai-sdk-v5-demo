# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **React + TypeScript + Vite** application that provides an AI-powered chat assistant interface. It uses:

- **@assistant-ui/react** - Core assistant UI components
- **@assistant-ui/react-ai-sdk** - AI SDK integration for chat functionality
- **@assistant-ui/react-markdown** - Markdown rendering for messages
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Styling with custom CSS variables for theming
- **Zod** - Schema validation for tool parameters

## Architecture

### Component Structure

The app follows a modular component architecture:

```
src/
├── App.tsx                          # Main app component, tool registration
├── main.tsx                         # App entry point
├── index.css                        # Global styles and Tailwind imports
├── components/
│   ├── assistant-ui/
│   │   ├── thread-list.tsx         # Sidebar thread list component
│   │   ├── thread.tsx              # Main chat thread with messages
│   │   ├── markdown-text.tsx       # Markdown rendering with custom components
│   │   ├── tool-fallback.tsx       # Default tool call UI
│   │   ├── attachment.tsx          # File attachment components
│   │   └── tooltip-icon-button.tsx # Reusable tooltip button
│   └── ui/
│       ├── button.tsx              # Base button component
│       ├── skeleton.tsx            # Loading skeleton
│       ├── dialog.tsx              # Dialog component
│       ├── tooltip.tsx             # Tooltip component
│       └── avatar.tsx              # Avatar component
└── lib/
    └── utils.ts                    # cn() utility for merging Tailwind classes
```

### Data Flow

1. **Chat Runtime** - `useChatRuntime` hook from `@assistant-ui/react-ai-sdk` manages chat state
2. **Transport Layer** - `AssistantChatTransport` connects to `/api/chat` endpoint
3. **Tool System** - Tools are registered via `makeAssistantTool()` and rendered in the chat
4. **Thread Management** - Thread list and thread view components manage conversation history

### Tool System

Tools are defined using the pattern:

```tsx
const myTool = tool({
  description: "Tool description",
  parameters: z.object({
    // Zod schema for parameters
  }),
  execute: async ({ param1, param2 }) => {
    // Tool logic
    return { result: "value" };
  },
});

const MyTool = makeAssistantTool({
  ...myTool,
  toolName: "myTool",
  render: ({ args, result, status }) => {
    // Custom UI for tool execution
    return <div>...</div>;
  },
});
```

The `status` parameter can be:
- `"executing"` - Tool is currently running
- `"complete"` - Tool finished successfully
- `{ type: "incomplete", reason: "cancelled" }` - Tool was cancelled

## Styling System

### Tailwind CSS v4

This project uses Tailwind CSS v4 with inline theme configuration in `index.css`:

- **CSS Variables** - All colors are defined as HSL CSS variables (`--background`, `--foreground`, etc.)
- **Dark Mode** - Class-based dark mode (`.dark` class on parent)
- **Custom Properties** - `@theme inline` block defines Tailwind theme from CSS variables

### Styling Patterns

- Use `cn()` utility from `lib/utils.ts` to merge Tailwind classes
- Components use semantic class names with `aui-` prefix for easier debugging
- Glassmorphism effects (backdrop-blur, semi-transparent backgrounds) used throughout
- Responsive design with mobile-first approach

### Color System

All colors use CSS custom properties:
- `bg-background` / `text-foreground` - Base colors
- `bg-muted` / `text-muted-foreground` - Secondary colors
- `bg-accent` - Interactive elements
- `border-border` / `border-input` - Borders and inputs

## Running Commands

```bash
pnpm dev          # Start dev server (http://localhost:5173)
pnpm build        # Build for production (TypeScript check + Vite build)
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
```

## Path Aliases

The project uses `@` as an alias for the `src` directory (configured in `vite.config.ts`):
```tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

## Important Notes

### API Endpoint

The app expects a backend API at `/api/chat` (configured in `App.tsx`). This endpoint should:
- Accept POST requests with chat messages
- Return AI responses compatible with the AI SDK format
- Support streaming responses (if using streaming)

### Client-Side Only

This is a **client-side only** application. The `/api/chat` endpoint needs to be implemented separately:
- As a Vite proxy in development
- As a separate backend service in production
- Or use a serverless function/cloud API

### Component Patterns

1. **Primitive Components** - Use `@assistant-ui/react` primitives (e.g., `ThreadPrimitive.Root`, `ComposerPrimitive.Input`)
2. **Compound Components** - Many UI components use compound pattern (e.g., `ThreadListPrimitive.Items`, `ThreadListPrimitive.New`)
3. **Conditional Rendering** - Use `AssistantIf` component for conditional rendering based on state
4. **Status-Based UI** - Tool renders should handle different states (executing, complete, error)

### Browser Compatibility

- Modern browsers with ES2020+ support
- Uses CSS features: `backdrop-filter`, CSS custom properties, `@layer`
- No IE11 support required
