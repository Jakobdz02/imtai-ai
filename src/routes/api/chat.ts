import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { categories, type CategoryId } from "@/lib/categories";

type ChatRequestBody = {
  messages?: unknown;
  category?: unknown;
};

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const body = (await request.json()) as ChatRequestBody;
        const messages = body.messages;
        const categoryId = body.category as CategoryId | undefined;

        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
          return new Response(
            "Server is missing OPENROUTER_API_KEY configuration.",
            { status: 500 },
          );
        }

        const model = (process.env.OPENROUTER_MODEL || "openrouter/free").trim();

        const cat =
          categoryId && categories[categoryId]
            ? categories[categoryId]
            : categories.personal;

        try {
          const origin = request.headers.get("origin") || "https://imtai.app";
          const openrouter = createOpenAICompatible({
            name: "openrouter",
            baseURL: "https://openrouter.ai/api/v1",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "HTTP-Referer": origin,
              "X-OpenRouter-Title": "IMTAI",
            },
          });

          const result = streamText({
            model: openrouter(model),
            system: cat.systemPrompt,
            messages: await convertToModelMessages(messages as UIMessage[]),
          });

          return result.toUIMessageStreamResponse({
            originalMessages: messages as UIMessage[],
          });
        } catch (err) {
          console.error("Chat handler error:", err);
          const message = err instanceof Error ? err.message : "Unknown error";
          const status = /unauthorized|invalid.*key/i.test(message)
            ? 401
            : /quota|rate/i.test(message)
              ? 429
              : 500;
          return new Response(message, { status });
        }
      },
    },
  },
});
