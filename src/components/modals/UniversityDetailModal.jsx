import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { statusConfig } from "@/lib/statusConfig";
import { daysRemaining, formatDeadline } from "@/lib/dateUtils";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";

export default function UniversityDetailModal({
  open,
  onOpenChange,
  university,
  onEdit,
  onDelete,
}) {
  if (!university) return null;

  const cfg = statusConfig[university.status] || statusConfig.researching;
  const days = daysRemaining(university.deadline);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] bg-card border-border p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-start justify-between pr-8">
            <div>
              <DialogTitle className="font-display text-lg font-bold">
                {university.name}
              </DialogTitle>
              {university.program && (
                <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wider">
                  {university.program}
                </p>
              )}
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] uppercase tracking-wider border ${cfg.badge}`}
            >
              <span className={`w-1.5 h-1.5 ${cfg.dot}`} />
              {cfg.label}
            </span>
          </div>
        </DialogHeader>

        <div className="px-6 py-4 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <InfoRow label="Country" value={university.country} />
            <InfoRow
              label="Deadline"
              value={formatDeadline(university.deadline)}
            />
            <InfoRow
              label="Days Remaining"
              value={
                days !== null ? (
                  <span
                    className={`font-semibold ${
                      days < 0
                        ? "text-red-500"
                        : days <= 14
                          ? "text-red-400"
                          : days <= 30
                            ? "text-amber-400"
                            : "text-emerald-400"
                    }`}
                  >
                    {days < 0
                      ? `${Math.abs(days)} days ago`
                      : days === 0
                        ? "Today"
                        : `${days} days`}
                  </span>
                ) : (
                  "—"
                )
              }
            />
            <InfoRow
              label="Fee"
              value={
                <span className="flex items-center gap-1">
                  {university.application_fee != null
                    ? `$${university.application_fee}`
                    : "—"}
                  {university.fee_paid && (
                    <Badge
                      variant="outline"
                      className="text-[9px] text-emerald-400 border-emerald-400/30 ml-1"
                    >
                      PAID
                    </Badge>
                  )}
                </span>
              }
            />
          </div>

          {/* Portal link */}
          {university.portal_url && (
            <a
              href={university.portal_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors border border-border px-3 py-2"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="truncate">{university.portal_url}</span>
            </a>
          )}

          {/* Notes */}
          {university.notes && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                Notes
              </p>
              <p className="text-sm text-foreground/80 whitespace-pre-wrap border border-border p-3 bg-background">
                {university.notes}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-3 border-t border-border flex justify-between">
          <Button
            size="sm"
            onClick={onEdit}
            className="text-xs uppercase tracking-wider"
          >
            <Pencil className="w-3.5 h-3.5 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-xs uppercase tracking-wider text-red-400 border-red-400/30 hover:bg-red-400/10 hover:text-red-400"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="border border-border p-2 bg-background">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5">
        {label}
      </p>
      <div className="text-foreground">{value}</div>
    </div>
  );
}
