import { useEffect, useState } from "react";
import type { UIMessage } from "ai";
import type { CategoryId } from "./categories";

export type Conversation = {
  id: string;
  title: string;
  category: CategoryId;
  createdAt: number;
  updatedAt: number;
  messages: UIMessage[];
};

const KEY = "imtai.conversations.v1";

export function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Conversation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveConversations(list: Conversation[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
}

export function useConversations() {
  const [list, setList] = useState<Conversation[]>([]);

  useEffect(() => {
    setList(loadConversations());
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setList(loadConversations());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const upsert = (c: Conversation) => {
    setList((prev) => {
      const next = [c, ...prev.filter((x) => x.id !== c.id)];
      saveConversations(next);
      return next;
    });
  };

  const remove = (id: string) => {
    setList((prev) => {
      const next = prev.filter((x) => x.id !== id);
      saveConversations(next);
      return next;
    });
  };

  const clear = () => {
    setList([]);
    saveConversations([]);
  };

  return { list, upsert, remove, clear, reload: () => setList(loadConversations()) };
}

export function newConversationId() {
  return `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function deriveTitle(text: string): string {
  const t = text.trim().replace(/\s+/g, " ");
  if (t.length <= 48) return t;
  return t.slice(0, 46) + "…";
}
