import { useState } from "react";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useI18n, langMeta, type Lang } from "@/lib/i18n";
import { saveConversations } from "@/lib/store";
import { toast } from "sonner";


export function SettingsModal({
  open,
  onOpenChange,
  onCleared,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onCleared?: () => void;
}) {
  const { t, lang, setLang } = useI18n();
  const [confirming, setConfirming] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong max-h-[90vh] max-w-lg overflow-y-auto border-border/60">
        <DialogHeader>
          <DialogTitle>{t("settings.title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t("settings.language")}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(langMeta) as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                    lang === l
                      ? "border-primary bg-primary/15 text-foreground shadow-glow"
                      : "border-border/60 bg-surface text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
                >
                  {langMeta[l].native}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-surface/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium">{t("settings.clear")}</span>
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </div>
            {confirming ? (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirming(false)}
                  className="flex-1"
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    saveConversations([]);
                    setConfirming(false);
                    onCleared?.();
                    toast.success(t("settings.cleared"));
                  }}
                  className="flex-1"
                >
                  {t("settings.clear")}
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirming(true)}
                className="w-full"
              >
                {t("settings.clear")}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
