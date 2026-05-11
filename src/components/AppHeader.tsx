import { Sparkles, Settings as SettingsIcon, Languages } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useI18n, langMeta, type Lang } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function AppHeader({ onOpenSettings }: { onOpenSettings?: () => void }) {
  const { lang, setLang, t } = useI18n();

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass-strong border-b border-border/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand shadow-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-semibold tracking-tight text-foreground">
                {t("app.name")}
              </span>
              <span className="hidden text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:block">
                AI Advisor
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 text-foreground/80 hover:text-foreground">
                  <Languages className="h-4 w-4" />
                  <span className="hidden sm:inline">{langMeta[lang].native}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-strong border-border/60">
                {(Object.keys(langMeta) as Lang[]).map((l) => (
                  <DropdownMenuItem
                    key={l}
                    onClick={() => setLang(l)}
                    className="cursor-pointer"
                  >
                    <span className="font-medium">{langMeta[l].native}</span>
                    <span className="ms-auto text-xs text-muted-foreground">{langMeta[l].label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {onOpenSettings && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onOpenSettings}
                aria-label={t("nav.settings")}
                className="text-foreground/80 hover:text-foreground"
              >
                <SettingsIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
