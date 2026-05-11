import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import {
  Menu,
  Send,
  Sparkles,
  ArrowLeft,
  Settings as SettingsIcon,
} from "lucide-react";
import { toast } from "sonner";

import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatMessage } from "@/components/ChatMessage";
import { SettingsModal } from "@/components/SettingsModal";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useI18n, langMeta, type Lang } from "@/lib/i18n";
import { categories, categoryList, type CategoryId } from "@/lib/categories";
import {
  newConversationId,
  deriveTitle,
  loadConversations,
  saveConversations,
  type Conversation,
} from "@/lib/store";

const searchSchema = z.object({
  c: z.enum(["business", "finance", "relationships", "personal", "education", "health"]).optional(),
  id: z.string().optional(),
});

export const Route = createFileRoute("/chat")({
  validateSearch: searchSchema,
  component: ChatPage,
  head: () => ({
    meta: [{ title: "IMTAI — Consultation" }],
  }),
});

function ChatPage() {
  const { t, lang, setLang, dir } = useI18n();
  const search = Route.useSearch();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [category, setCategory] = useState<CategoryId>(search.c ?? "personal");
  const [initialMessages, setInitialMessages] = useState<UIMessage[]>([]);
  const [chatKey, setChatKey] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [input, setInput] = useState("");

  // Initial load: pick conversation from URL or create new
  useEffect(() => {
    const list = loadConversations();
    setConversations(list);

    if (search.id) {
      const found = list.find((c) => c.id === search.id);
      if (found) {
        setActiveId(found.id);
        setCategory(found.category);
        setInitialMessages(found.messages);
        setChatKey((k) => k + 1);
        return;
      }
    }

    // Create fresh conversation (not yet persisted)
    const id = newConversationId();
    setActiveId(id);
    setInitialMessages([]);
    setChatKey((k) => k + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: () => ({ category }),
      }),
    [category],
  );

  const { messages, sendMessage, status, regenerate, error, stop } = useChat({
    id: activeId || "default",
    messages: initialMessages,
    transport,
    onError: (e) => {
      const msg = e?.message || "";
      if (msg.includes("429")) toast.error(t("chat.rate"));
      else if (msg.includes("402")) toast.error(t("chat.credits"));
      else toast.error(t("chat.error"));
    },
  });

  // Persist conversation on every message update (after assistant reply lands)
  useEffect(() => {
    if (!activeId || messages.length === 0) return;
    if (status === "submitted" || status === "streaming") return;

    const firstUser = messages.find((m) => m.role === "user");
    const title =
      firstUser
        ? deriveTitle(
            firstUser.parts
              .map((p) => (p.type === "text" ? p.text : ""))
              .join(""),
          )
        : "New consultation";

    const now = Date.now();
    const list = loadConversations();
    const existing = list.find((c) => c.id === activeId);
    const conv: Conversation = {
      id: activeId,
      title,
      category,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      messages: messages as UIMessage[],
    };
    const next = [conv, ...list.filter((c) => c.id !== activeId)];
    saveConversations(next);
    setConversations(next);
  }, [messages, status, activeId, category]);

  // Auto-scroll
  const scrollerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeId, status]);

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    sendMessage({ text });
  };

  const onNew = () => {
    const id = newConversationId();
    setActiveId(id);
    setInitialMessages([]);
    setChatKey((k) => k + 1);
    setSidebarOpen(false);
    navigate({ to: "/chat", search: { c: category } });
  };

  const onSelect = (id: string) => {
    const found = conversations.find((c) => c.id === id);
    if (!found) return;
    setActiveId(found.id);
    setCategory(found.category);
    setInitialMessages(found.messages);
    setChatKey((k) => k + 1);
    setSidebarOpen(false);
    navigate({ to: "/chat", search: { id: found.id } });
  };

  const onDelete = (id: string) => {
    const next = conversations.filter((c) => c.id !== id);
    saveConversations(next);
    setConversations(next);
    if (id === activeId) onNew();
  };

  const onSwitchCategory = (id: CategoryId) => {
    setCategory(id);
    if (messages.length === 0) {
      // No messages yet — safe to swap category on the same conversation
      navigate({ to: "/chat", search: { c: id } });
    } else {
      // Start fresh thread for new category
      const newId = newConversationId();
      setActiveId(newId);
      setInitialMessages([]);
      setChatKey((k) => k + 1);
      navigate({ to: "/chat", search: { c: id } });
    }
  };

  const cat = categories[category];
  const accent = `var(${cat.accent})`;
  const CatIcon = cat.icon;

  return (
    <div className="flex h-dvh w-full overflow-hidden" dir={dir}>
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <ChatSidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={onSelect}
          onNew={onNew}
          onDelete={onDelete}
        />
      </div>

      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side={dir === "rtl" ? "right" : "left"}
          className="w-72 border-border/60 bg-surface/95 p-0"
        >
          <ChatSidebar
            conversations={conversations}
            activeId={activeId}
            onSelect={onSelect}
            onNew={onNew}
            onDelete={onDelete}
            onClose={() => setSidebarOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="glass-strong z-10 flex h-14 shrink-0 items-center gap-2 border-b border-border/60 px-3 sm:px-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="hidden h-9 w-9 sm:inline-flex"
            onClick={() => navigate({ to: "/" })}
            aria-label="Home"
          >
            <ArrowLeft
              className="h-4 w-4"
              style={{ transform: dir === "rtl" ? "scaleX(-1)" : undefined }}
            />
          </Button>

          {/* Category switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="ms-1 h-9 gap-2 rounded-xl px-2.5 text-sm font-medium"
              >
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-md"
                  style={{
                    background: `color-mix(in oklch, ${accent} 18%, transparent)`,
                    color: accent,
                  }}
                >
                  <CatIcon className="h-3.5 w-3.5" />
                </span>
                <span className="truncate">{t(`cat.${category}.title`)}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="glass-strong w-60 border-border/60">
              {categoryList.map((c) => {
                const Icon = c.icon;
                const a = `var(${c.accent})`;
                return (
                  <DropdownMenuItem
                    key={c.id}
                    onClick={() => onSwitchCategory(c.id)}
                    className="cursor-pointer gap-2"
                  >
                    <span
                      className="flex h-6 w-6 items-center justify-center rounded-md"
                      style={{
                        background: `color-mix(in oklch, ${a} 18%, transparent)`,
                        color: a,
                      }}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm">{t(`cat.${c.id}.title`)}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="ms-auto flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 px-2 text-xs font-medium uppercase">
                  {lang}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-strong border-border/60">
                {(Object.keys(langMeta) as Lang[]).map((l) => (
                  <DropdownMenuItem key={l} onClick={() => setLang(l)} className="cursor-pointer">
                    {langMeta[l].native}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setSettingsOpen(true)}
              aria-label={t("nav.settings")}
            >
              <SettingsIcon className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Messages */}
        <div ref={scrollerRef} className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6" key={chatKey}>
            {messages.length === 0 ? (
              <EmptyState category={category} />
            ) : (
              <div className="space-y-6">
                {messages.map((m, i) => (
                  <ChatMessage
                    key={m.id}
                    message={m}
                    category={category}
                    isLast={i === messages.length - 1 && m.role === "assistant"}
                    isStreaming={isLoading && i === messages.length - 1}
                    onRegenerate={() => regenerate()}
                  />
                ))}
                {error && (
                  <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                    {t("chat.error")}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Composer */}
        <div className="shrink-0 border-t border-border/60 bg-background/40 backdrop-blur-xl">
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex max-w-3xl items-end gap-2 px-4 py-3 sm:px-6 sm:py-4"
          >
            <div
              className="relative flex flex-1 items-end rounded-2xl border border-border/70 bg-surface-elevated/80 shadow-card transition-all focus-within:border-primary/60 focus-within:shadow-glow"
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                rows={1}
                placeholder={t("chat.placeholder")}
                className="max-h-40 min-h-[52px] flex-1 resize-none bg-transparent px-4 py-3.5 text-[15px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
                style={{
                  height: "auto",
                }}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = Math.min(el.scrollHeight, 160) + "px";
                }}
              />
              <Button
                type={isLoading ? "button" : "submit"}
                onClick={isLoading ? () => stop() : undefined}
                size="icon"
                className="me-1.5 mb-1.5 h-10 w-10 shrink-0 rounded-xl bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-95 disabled:opacity-50"
                disabled={!isLoading && !input.trim()}
                aria-label={t("chat.send")}
              >
                {isLoading ? (
                  <span className="h-3 w-3 rounded-sm bg-current" />
                ) : (
                  <Send
                    className="h-4 w-4"
                    style={{ transform: dir === "rtl" ? "scaleX(-1)" : undefined }}
                  />
                )}
              </Button>
            </div>
          </form>
          <p className="px-6 pb-3 text-center text-[11px] text-muted-foreground/80">
            {t("app.name")} · {t("badge.evidence")} — not a substitute for licensed professional advice.
          </p>
        </div>
      </div>

      <SettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        onCleared={() => {
          setConversations([]);
          onNew();
        }}
      />
    </div>
  );
}

function EmptyState({ category }: { category: CategoryId }) {
  const { t } = useI18n();
  const cat = categories[category];
  const accent = `var(${cat.accent})`;
  const Icon = cat.icon;

  const suggestions: Record<CategoryId, string[]> = {
    business: [
      "Help me decide whether to take a senior role at a startup or stay at a stable company.",
      "How should I think about pricing for my new B2B product?",
    ],
    finance: [
      "I'm 30 and just started saving — how should I structure my finances?",
      "Walk me through how to think about an emergency fund vs. paying off debt.",
    ],
    relationships: [
      "I need to set a boundary with a close friend without hurting them.",
      "How do I have a hard conversation with my partner about money?",
    ],
    personal: [
      "Help me decide whether to relocate for a new opportunity.",
      "I'm stuck between two career paths — walk me through a decision framework.",
    ],
    education: [
      "Design a 90-day learning plan for me to learn machine learning.",
      "What's the most effective way to learn a new language as an adult?",
    ],
    health: [
      "Help me build a sustainable morning routine.",
      "What's an evidence-based approach to better sleep?",
    ],
  };

  return (
    <div className="flex flex-col items-center pt-8 text-center sm:pt-16">
      <div
        className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl shadow-glow"
        style={{
          background: `linear-gradient(135deg, ${accent}, color-mix(in oklch, ${accent} 50%, var(--brand-glow)))`,
        }}
      >
        <Sparkles className="h-7 w-7 text-primary-foreground" strokeWidth={2.5} />
      </div>
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {t("chat.empty.title")}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {t("chat.empty.subtitle")}
      </p>

      <div className="mt-8 flex items-center gap-2 text-xs font-medium" style={{ color: accent }}>
        <Icon className="h-3.5 w-3.5" />
        <span>{t(`cat.${category}.title`)}</span>
      </div>

      <div className="mt-6 grid w-full max-w-2xl gap-2 sm:grid-cols-2">
        {suggestions[category].map((s) => (
          <SuggestionPill key={s} text={s} />
        ))}
      </div>
    </div>
  );
}

function SuggestionPill({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-surface/60 p-3.5 text-start text-sm text-foreground/85 shadow-card transition-colors hover:border-border hover:bg-surface">
      {text}
    </div>
  );
}
