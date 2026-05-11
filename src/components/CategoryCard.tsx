import { motion } from "framer-motion";
import type { Category } from "@/lib/categories";
import { useI18n } from "@/lib/i18n";
import { ArrowRight } from "lucide-react";

export function CategoryCard({
  category,
  index,
  onSelect,
}: {
  category: Category;
  index: number;
  onSelect: (id: Category["id"]) => void;
}) {
  const { t, dir } = useI18n();
  const Icon = category.icon;
  const accent = `var(${category.accent})`;

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(category.id)}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.985 }}
      className="group relative w-full overflow-hidden rounded-3xl border border-border/60 bg-gradient-card p-6 text-start shadow-card transition-all duration-300 hover:border-border hover:shadow-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      style={{ ["--card-accent" as string]: accent }}
    >
      {/* Accent glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -end-20 h-48 w-48 rounded-full opacity-30 blur-3xl transition-opacity duration-500 group-hover:opacity-60"
        style={{ background: accent }}
      />
      {/* Top border highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-0 h-px opacity-50"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />

      <div className="relative flex flex-col gap-5">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/60 transition-transform duration-300 group-hover:scale-110"
          style={{
            background: `color-mix(in oklch, ${accent} 18%, transparent)`,
            boxShadow: `0 0 30px -8px color-mix(in oklch, ${accent} 50%, transparent)`,
          }}
        >
          <Icon className="h-6 w-6" style={{ color: accent }} strokeWidth={2} />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            {t(`cat.${category.id}.title`)}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {t(`cat.${category.id}.desc`)}
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: accent }}>
          <span>{t("hero.cta")}</span>
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
            style={{ transform: dir === "rtl" ? "scaleX(-1)" : undefined }}
          />
        </div>
      </div>
    </motion.button>
  );
}
