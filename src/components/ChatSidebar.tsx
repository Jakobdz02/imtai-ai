import { Plus, MessageSquare, Trash2, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { categories } from "@/lib/categories";
import type { Conversation } from "@/lib/store";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onClose,
}: {
  conversations: Conversation[];
  activeId?: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onClose?: () => void;
}) {
  const { t } = useI18n();

  return (
    <aside className="flex h-full w-72 flex-col border-e border-border/60 bg-surface/50 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-2 p-3">
        <Link to="/" className="flex items-center gap-2 px-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand">
            <span className="text-xs font-bold text-primary-foreground">I</span>
          </div>
          <span className="text-sm font-semibold tracking-tight">{t("app.name")}</span>
        </Link>
        {onClose && (
          <Button variant="ghost" size="icon" className="h-8 w-8 lg:hidden" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="px-3">
        <Button
          onClick={onNew}
          className="w-full justify-start gap-2 bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-95"
        >
          <Plus className="h-4 w-4" />
          {t("nav.new")}
        </Button>
      </div>

      <div className="mt-5 px-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {t("nav.history")}
      </div>

      <ScrollArea className="mt-2 flex-1 px-2">
        {conversations.length === 0 ? (
          <div className="px-3 py-8 text-center text-xs text-muted-foreground">
            {t("sidebar.empty")}
          </div>
        ) : (
          <ul className="space-y-0.5 pb-4">
            {conversations.map((c) => {
              const cat = categories[c.category];
              const accent = `var(${cat.accent})`;
              const active = c.id === activeId;
              return (
                <li key={c.id}>
                  <div
                    className={`group flex items-center gap-2 rounded-lg px-2 py-2 transition-colors ${
                      active ? "bg-accent/60" : "hover:bg-accent/40"
                    }`}
                  >
                    <button
                      onClick={() => onSelect(c.id)}
                      className="flex min-w-0 flex-1 items-center gap-2 text-start"
                    >
                      <MessageSquare
                        className="h-3.5 w-3.5 shrink-0"
                        style={{ color: accent }}
                      />
                      <span className="truncate text-sm text-foreground/90">{c.title}</span>
                    </button>
                    <button
                      onClick={() => onDelete(c.id)}
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </ScrollArea>
    </aside>
  );
}
