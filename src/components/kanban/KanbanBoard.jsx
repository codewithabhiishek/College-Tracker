import { statusConfig, ALL_STATUSES } from "@/lib/statusConfig";
import { daysRemaining } from "@/lib/dateUtils";
import { format, parseISO } from "date-fns";
import { ExternalLink } from "lucide-react";

function KanbanCard({ uni, onClick }) {
  const days = daysRemaining(uni.deadline);

  return (
    <div
      onClick={() => onClick(uni)}
      className="border border-border bg-background p-3 cursor-pointer hover:border-primary/40 transition-colors group"
    >
      <div className="font-display font-medium text-sm text-foreground group-hover:text-primary transition-colors">
        {uni.name}
      </div>
      {uni.program && (
        <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">
          {uni.program}
        </div>
      )}
      <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
        <span className="uppercase tracking-wider">{uni.country}</span>
        {days !== null && (
          <span
            className={`font-semibold tabular-nums ${
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
              ? `${Math.abs(days)}d ago`
              : days === 0
                ? "Today"
                : `${days}d`}
          </span>
        )}
      </div>
      {uni.deadline && (
        <div className="text-[10px] text-muted-foreground/60 mt-1">
          {format(parseISO(uni.deadline), "dd MMM yyyy")}
        </div>
      )}
      <div className="flex items-center justify-between mt-2">
        {uni.portal_url && (
          <a
            href={uni.portal_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}

export default function KanbanBoard({ universities, onCardClick }) {
  return (
    <div className="flex gap-3 overflow-x-auto p-4 min-h-[400px]">
      {ALL_STATUSES.map((status) => {
        const cfg = statusConfig[status];
        const unis = universities.filter((u) => u.status === status);

        return (
          <div key={status} className="min-w-[220px] w-[220px] flex-shrink-0">
            <div className="flex items-center gap-2 px-2 py-2 mb-2 border-b border-border">
              <div className={`w-2 h-2 ${cfg.dot}`} />
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-display font-medium">
                {cfg.label}
              </span>
              <span className="text-[10px] text-muted-foreground/60 ml-auto tabular-nums">
                {unis.length}
              </span>
            </div>
            <div className="space-y-2">
              {unis.map((uni) => (
                <KanbanCard key={uni.id} uni={uni} onClick={onCardClick} />
              ))}
              {unis.length === 0 && (
                <div className="text-[10px] text-muted-foreground/30 uppercase tracking-widest text-center py-8 border border-dashed border-border/50">
                  Empty
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
