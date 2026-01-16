"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import {
  useChatRuntime,
  AssistantChatTransport,
} from "@assistant-ui/react-ai-sdk";
import { ThreadList } from "@/components/assistant-ui/thread-list";
import { Thread } from "@/components/assistant-ui/thread";
import { makeAssistantTool, tool } from "@assistant-ui/react";
import { z } from "zod";

const calculatorTool = tool({
  description: "Calculator",
  parameters: z.object({
    num1: z.number().describe("the fisrt number"),
    num2: z.number().describe("the second number"),
  }),
  execute: async ({ num1, num2 }) => {
    console.log("执行到计算阶段");
    const sum = num1 + num2;
    return { sum: sum };
  },
});

const CalculatorTool = makeAssistantTool({
  ...calculatorTool,
  toolName: "calculator",
  render: ({ args, result, status }) => {
    const isLoading = status === "executing";

    return (
      <div className="my-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 px-5 py-3 border border-violet-200/20 dark:border-violet-700/30 shadow-sm hover:shadow-md transition-shadow duration-200">
        <span className="text-violet-600 dark:text-violet-400 font-semibold text-base">
          {args.num1}
        </span>
        <span className="text-violet-400 text-lg">+</span>
        <span className="text-violet-600 dark:text-violet-400 font-semibold text-base">
          {args.num2}
        </span>
        <span className="text-violet-400 text-lg">=</span>
        <span
          className={`
            ml-2 px-4 py-1.5 rounded-lg font-bold text-lg
            ${
              isLoading
                ? "bg-violet-300 dark:bg-violet-700 text-violet-100 dark:text-violet-300 animate-pulse"
                : "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/30"
            }
            transition-all duration-300
          `}
        >
          {isLoading ? "..." : result?.sum ?? "—"}
        </span>
      </div>
    );
  },
});

export default function App() {
  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api:
        import.meta.env.VITE_MASTRA_URL ||
        "http://localhost:4111/agent/weatherAgent",
    }),
  });
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {/* Sidebar - Thread List */}
        <aside className="hidden md:flex w-80 flex-col border-r border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-sm">
          {/* Sidebar Header */}
          <div className="border-b border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  AI Assistant
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Powered by Claude
                </p>
              </div>
            </div>
          </div>

          {/* Thread List Container */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <ThreadList />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-30 dark:opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(148_163_184)_1px,transparent_0)] [background-size:24px_24px]"></div>
          </div>

          {/* Content */}
          <div className="relative flex-1 overflow-hidden">
            <CalculatorTool />
            <Thread />
          </div>
        </main>
      </div>
    </AssistantRuntimeProvider>
  );
}
