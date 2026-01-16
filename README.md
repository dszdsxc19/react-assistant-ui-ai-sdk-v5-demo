# AI Assistant UI - React + TypeScript + Vite

一个基于 React 的 AI 助手聊天界面应用，集成了 **[@assistant-ui/react](https://assistant-ui.com/)** 和 **[AI SDK v5](https://sdk.vercel.ai/)**。

> ✨ 本项目展示了如何使用 assistant-ui 的 **client-side tools** 功能，让 AI 助手能够直接在浏览器中执行前端工具调用。

## ✨ 特性

- 🤖 **AI SDK v5 集成** - 使用最新的 Vercel AI SDK v5 进行对话管理
- 🛠️ **Client-Side Tools** - 支持在浏览器端直接执行工具调用（无需后端）
  - 工具定义使用 `tool()` 创建
  - UI 渲染使用 `makeAssistantTool()` 自定义
  - 自动处理工具执行状态（executing、complete、cancelled）
- 🎨 **现代化 UI** - 使用 Tailwind CSS v4 构建的精美界面
- 🌓 **深色模式** - 完整支持明暗主题切换
- 📱 **响应式设计** - 适配桌面和移动端
- ⚡ **Vite 构建** - 快速的开发体验和热更新
- 💬 **Markdown 支持** - 消息支持完整的 Markdown 渲染
- 🧵 **多线程管理** - 侧边栏管理多个对话会话

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

访问 `http://localhost:5173` 查看应用。

### 构建生产版本

```bash
pnpm build
```

### 预览生产构建

```bash
pnpm preview
```

### 代码检查

```bash
pnpm lint
```

## 📦 技术栈

- **React 19** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Tailwind CSS v4** - 样式框架
- **[@assistant-ui/react](https://assistant-ui.com/)** - 助手 UI 组件库
- **[@assistant-ui/react-ai-sdk](https://assistant-ui.com/)** - AI SDK v5 集成层
- **[AI SDK v5](https://sdk.vercel.ai/)** - Vercel AI SDK 核心
- **Zod** - 工具参数验证
- **Lucide React** - 图标库

## 🏗️ 项目结构

```
src/
├── App.tsx                          # 主应用组件，工具注册
├── main.tsx                         # 应用入口
├── index.css                        # 全局样式和 Tailwind 配置
├── components/
│   ├── assistant-ui/
│   │   ├── thread-list.tsx         # 侧边栏线程列表
│   │   ├── thread.tsx              # 主聊天线程
│   │   ├── markdown-text.tsx       # Markdown 渲染组件
│   │   ├── tool-fallback.tsx       # 默认工具调用 UI
│   │   ├── attachment.tsx          # 附件组件
│   │   └── tooltip-icon-button.tsx # 工具提示按钮
│   └── ui/
│       ├── button.tsx              # 基础按钮组件
│       ├── skeleton.tsx            # 加载骨架屏
│       ├── dialog.tsx              # 对话框组件
│       ├── tooltip.tsx             # 工具提示组件
│       └── avatar.tsx              # 头像组件
└── lib/
    └── utils.ts                    # 工具函数（cn 样式合并）
```

## 🔧 Client-Side Tools 系统

本项目的核心特性是 **assistant-ui 的 client-side tools**，允许在浏览器端直接执行工具调用。

### 工作原理

1. **工具定义** - 使用 `tool()` 定义工具的参数和执行逻辑
2. **工具注册** - 使用 `makeAssistantTool()` 创建 UI 组件
3. **自动集成** - assistant-ui 自动处理工具调用的整个生命周期

### 完整示例

```tsx
import { tool, makeAssistantTool } from "@assistant-ui/react";
import { z } from "zod";

// 1. 定义工具逻辑
const calculatorTool = tool({
  description: "执行简单的加法计算",
  parameters: z.object({
    num1: z.number().describe("第一个数字"),
    num2: z.number().describe("第二个数字"),
  }),
  execute: async ({ num1, num2 }) => {
    // 在浏览器端执行计算
    const sum = num1 + num2;
    return { sum };
  },
});

// 2. 创建工具 UI 组件
const CalculatorTool = makeAssistantTool({
  ...calculatorTool,
  toolName: "calculator",
  render: ({ args, result, status }) => {
    const isLoading = status === "executing";

    return (
      <div className="inline-flex items-center gap-2 rounded-lg bg-violet-500/10 px-4 py-3">
        <span className="font-medium">{args.num1}</span>
        <span>+</span>
        <span className="font-medium">{args.num2}</span>
        <span>=</span>
        <span className={isLoading ? "animate-pulse" : ""}>
          {isLoading ? "..." : result?.sum}
        </span>
      </div>
    );
  },
});

// 3. 在 App 中使用
function App() {
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <CalculatorTool />  {/* 注册工具 */}
      <Thread />
    </AssistantRuntimeProvider>
  );
}
```

### 工具状态

`status` 参数表示工具的当前状态：

- **`"executing"`** - 工具正在执行（显示加载动画）
- **`"complete"`** - 工具执行成功（显示结果）
- **`{ type: "incomplete", reason: "cancelled" }`** - 工具被取消（显示错误）

### Client-Side vs Server-Side Tools

**Client-Side Tools（本项目使用）：**
- ✅ 在浏览器端直接执行
- ✅ 无需后端 API 支持
- ✅ 适合前端计算、UI 操作等
- ❌ 不能访问敏感数据或后端资源

**Server-Side Tools：**
- ✅ 可以访问数据库和 API
- ✅ 更安全的执行环境
- ❌ 需要后端 API 支持
- ❌ 增加网络延迟

### 最佳实践

1. **类型安全** - 始终使用 Zod 定义参数类型
2. **错误处理** - 在 `execute` 中处理可能的错误
3. **加载状态** - 在 UI 中正确处理 `"executing"` 状态
4. **工具描述** - 提供清晰的 `description` 帮助 AI 理解工具用途

## 🎨 样式系统

### Tailwind CSS v4

项目使用 Tailwind CSS v4 的内联主题配置：

- **CSS 变量** - 所有颜色都定义为 HSL CSS 变量（`--background`、`--foreground` 等）
- **深色模式** - 基于类的深色模式（父元素上的 `.dark` 类）
- **自定义属性** - `@theme inline` 块从 CSS 变量定义 Tailwind 主题

### 颜色系统

所有颜色使用 CSS 自定义属性：

- `bg-background` / `text-foreground` - 基础颜色
- `bg-muted` / `text-muted-foreground` - 次要颜色
- `bg-accent` - 交互元素
- `border-border` / `border-input` - 边框和输入框

## 🔌 AI SDK v5 集成

本项目使用 **AI SDK v5** 的 `useChatRuntime` hook 和 `AssistantChatTransport` 来管理对话。

### 运行时配置

```tsx
import { useChatRuntime, AssistantChatTransport } from "@assistant-ui/react-ai-sdk";

function App() {
  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: "/api/chat",  // 后端 AI 聊天端点
    }),
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <Thread />
    </AssistantRuntimeProvider>
  );
}
```

### API 端点要求

`/api/chat` 端点应该：

- ✅ 接受 POST 请求（包含聊天消息和工具调用）
- ✅ 返回 **AI SDK v5** 兼容的流式响应
- ✅ 支持工具调用协议（server-side tools）
- ✅ 设置正确的 CORS 头（如果跨域）

### 示例 API 实现（Next.js）

```typescript
// app/api/chat/route.ts
import { openai } from '@ai-sdk/openai-compatible';
import { streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('your-model'),
    messages,
    // 可以在这里定义 server-side tools
    tools: {},
  });

  return result.toDataStreamResponse();
}
```

### Client-Side vs Server-Side

**Client-Side Tools（本项目的计算器工具）：**
- 在 `App.tsx` 中使用 `tool()` 定义
- 在浏览器中直接执行
- 不需要后端支持

**Server-Side Tools（可选）：**
- 在后端 API 的 `streamText()` 中定义
- 在服务器上执行
- 可以访问数据库和外部 API

本项目主要展示 **client-side tools**，但你可以同时使用两种类型的工具！

## 📝 路径别名

项目使用 `@` 作为 `src` 目录的别名（在 `vite.config.ts` 中配置）：

```tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

## 🌐 浏览器兼容性

- 支持 ES2020+ 的现代浏览器
- 使用 CSS 特性：`backdrop-filter`、CSS 自定义属性、`@layer`
- 不需要 IE11 支持

## 📚 相关资源

- **[@assistant-ui/react 文档](https://assistant-ui.com/)** - Assistant UI 组件库官方文档
- **[AI SDK v5 文档](https://sdk.vercel.ai/)** - Vercel AI SDK 官方文档
- **[Client-Side Tools 指南](https://assistant-ui.com/docs/the-basics/client-side-tools)** - 深入了解前端工具
- **[Vite 文档](https://vite.dev/)** - 构建工具文档
- **[Tailwind CSS 文档](https://tailwindcss.com/)** - 样式框架文档
- **[React 文档](https://react.dev/)** - React 框架文档

## 📄 许可证

MIT
