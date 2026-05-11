import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { UIMessage } from "ai";
import { Sparkles, Copy, Check, RefreshCw, User } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { categories, type CategoryId } from "@/lib/categories";

function getText(m: UIMessage): string {
  return m.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("")
    .trim();
}

export function ChatMessage({
  message,
  category,
  onRegenerate,
  isLast,
  isStreaming,
}: {
  message: UIMessage;
  category: CategoryId;
  onRegenerate?: () => void;
  isLast?: boolean;
  isStreaming?: boolean;
}) {
  const { t, dir } = useI18n();
  const [copied, setCopied] = useState(false);
  const cat = categories[category];
  const accent = `var(${cat.accent})`;

  const isUser = message.role === "user";
  const text = getText(message);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className={`flex w-full gap-3 ${dir === "rtl" ? "flex-row-reverse" : ""} justify-end`}
      >
        <div className="max-w-[85%] rounded-3xl rounded-ee-md bg-gradient-brand px-4 py-2.5 text-primary-foreground shadow-glow sm:max-w-[75%]">
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{text}</p>
        </div>
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/60 bg-surface text-muted-foreground">
          <User className="h-4 w-4" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group flex w-full gap-3"
    >
      <div
        className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/60 shadow-glow"
        style={{
          background: `linear-gradient(135deg, ${accent}, color-mix(in oklch, ${accent} 60%, var(--brand-glow)))`,
        }}
      >
        <Sparkles className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">IMTAI</span>
          <span
            className="rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider"
            style={{
              color: accent,
              borderColor: `color-mix(in oklch, ${accent} 35%, transparent)`,
              background: `color-mix(in oklch, ${accent} 10%, transparent)`,
            }}
          >
            {t(`cat.${category}.title`)}
          </span>
        </div>

        <div
          className="relative overflow-hidden rounded-3xl rounded-ss-md border border-border/60 bg-gradient-card p-4 shadow-card sm:p-5"
          style={{
            backgroundImage: `linear-gradient(145deg, color-mix(in oklch, ${accent} 4%, transparent), transparent 60%)`,
          }}
        >
          {text ? (
            <div className="prose-chat text-[15px] text-foreground/95">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
              </span>
              <span>{t("chat.thinking")}</span>
            </div>
          )}
        </div>

        {text && !isStreaming && (
          <div className="mt-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              size="sm"
              variant="ghost"
              onClick={copy}
              className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? t("chat.copied") : t("chat.copy")}
            </Button>
            {isLast && onRegenerate && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onRegenerate}
                className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="h-3 w-3" />
                {t("chat.regenerate")}
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
