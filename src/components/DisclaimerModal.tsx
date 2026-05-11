import { ShieldAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export function DisclaimerModal({
  open,
  onContinue,
  onCancel,
}: {
  open: boolean;
  onContinue: () => void;
  onCancel: () => void;
}) {
  const { t } = useI18n();
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="glass-strong max-w-md border-border/60 shadow-elevated">
        <DialogHeader>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand shadow-glow">
            <ShieldAlert className="h-6 w-6 text-primary-foreground" />
          </div>
          <DialogTitle className="text-center text-xl font-semibold tracking-tight">
            {t("disclaimer.title")}
          </DialogTitle>
          <DialogDescription className="text-center text-sm leading-relaxed text-muted-foreground">
            {t("disclaimer.body")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
          <Button variant="ghost" onClick={onCancel} className="sm:flex-1">
            {t("disclaimer.cancel")}
          </Button>
          <Button
            onClick={onContinue}
            className="bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-95 sm:flex-1"
          >
            {t("disclaimer.continue")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
