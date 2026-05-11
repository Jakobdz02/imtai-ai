import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, ArrowDown } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { CategoryCard } from "@/components/CategoryCard";
import { DisclaimerModal } from "@/components/DisclaimerModal";
import { SettingsModal } from "@/components/SettingsModal";
import { categoryList, type CategoryId } from "@/lib/categories";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "IMTAI — Your Smart Multilingual AI Advisor" },
      {
        name: "description",
        content:
          "Evidence-based, multilingual AI guidance for career, finance, relationships, decisions, education and wellness.",
      },
    ],
  }),
});

function Index() {
  const { t, dir } = useI18n();
  const navigate = useNavigate();
  const [pending, setPending] = useState<CategoryId | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const onSelect = (id: CategoryId) => setPending(id);

  const onContinue = () => {
    if (pending) {
      navigate({ to: "/chat", search: { c: pending } });
    }
  };

  return (
    <div className="relative min-h-screen" dir={dir}>
      {/* Background ornaments */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-cat-relationships/10 blur-[120px]" style={{ background: "color-mix(in oklch, var(--cat-relationships) 20%, transparent)" }} />
      </div>

      <AppHeader onOpenSettings={() => setSettingsOpen(true)} />

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-4 pb-16 pt-20 text-center sm:px-6 sm:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>{t("app.tagline")}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            <span className="text-gradient-brand">{t("hero.title")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mt-5 max-w-xl text-balance text-base text-muted-foreground sm:text-lg"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button
              size="lg"
              onClick={() =>
                document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" })
              }
              className="h-12 gap-2 rounded-2xl bg-gradient-brand px-7 text-base font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] hover:opacity-95"
            >
              {t("hero.cta")}
              <ArrowDown className="h-4 w-4" />
            </Button>
          </motion.div>

          {/* Floating glass tile preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto mt-16 hidden max-w-2xl sm:block"
          >
            <div className="glass-strong relative animate-float overflow-hidden rounded-3xl p-1 shadow-elevated">
              <div className="rounded-[1.4rem] bg-surface/70 p-6 text-start">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-brand">
                    <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-semibold">IMTAI</span>
                  <span className="ms-auto rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                    {t("badge.evidence")}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-foreground/85">
                  I'll meet you where you are — reflect your situation back, share what the
                  evidence suggests, and walk through clear next steps tailored to your goals.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Categories */}
        <section id="categories" className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {t("categories.title")}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
              {t("categories.subtitle")}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryList.map((cat, i) => (
              <CategoryCard key={cat.id} category={cat} index={i} onSelect={onSelect} />
            ))}
          </div>
        </section>

        <footer className="border-t border-border/40 py-8">
          <div className="mx-auto max-w-7xl px-4 text-center text-xs text-muted-foreground sm:px-6">
            © {new Date().getFullYear()} {t("app.name")} · {t("app.tagline")}
          </div>
        </footer>
      </main>

      <DisclaimerModal
        open={pending !== null}
        onContinue={onContinue}
        onCancel={() => setPending(null)}
      />

      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
