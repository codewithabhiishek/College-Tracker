import { statusConfig } from "@/lib/statusConfig";

export default function SummaryStats({ universities, globalDocs, statusFilter, setStatusFilter }) {
  const statusCounts = {};
  const allStatuses = [
    "researching",
    "preparing",
    "submitted",
    "interview",
    "accepted",
    "rejected",
    "waitlisted",
  ];
  allStatuses.forEach((s) => {
    statusCounts[s] = 0;
  });
  universities.forEach((u) => {
    if (statusCounts[u.status] !== undefined) statusCounts[u.status]++;
  });

  const readyDocs = globalDocs.filter((d) => d.is_ready).length;
  const totalDocs = globalDocs.length;

  return (
    <div className="border-b border-border px-6 py-3 flex flex-wrap items-center gap-3 text-xs">
      <span className="text-muted-foreground uppercase tracking-widest mr-1 font-display text-[10px]">
        /01 Status
      </span>
      {allStatuses.map((status) => {
        const cfg = statusConfig[status];
        const count = statusCounts[status];
        const isActive = statusFilter === status;
        return (
          <div
            key={status}
            onClick={() => setStatusFilter(isActive ? null : status)}
            className={`flex items-center gap-1.5 px-2 py-1 border transition-colors cursor-pointer select-none ${
              isActive 
                ? "border-primary bg-primary/10" 
                : "border-border hover:bg-secondary/50"
            }`}
          >
            <div className={`w-1.5 h-1.5 ${cfg.dot}`} />
            <span className={`uppercase tracking-wider ${isActive ? "text-primary" : "text-muted-foreground"}`}>
              {cfg.short}
            </span>
            <span className="text-foreground font-semibold">{count}</span>
          </div>
        );
      })}
      <div className="ml-auto flex items-center gap-1.5 px-2 py-1 border border-border">
        <span className="uppercase tracking-wider text-muted-foreground">
          Shared Docs
        </span>
        <span className="text-primary font-semibold">
          {readyDocs}/{totalDocs}
        </span>
      </div>
      <div className="px-2 py-1 border border-border">
        <span className="uppercase tracking-wider text-muted-foreground">
          Total
        </span>{" "}
        <span className="text-foreground font-semibold">
          {universities.length}
        </span>
      </div>
    </div>
  );
}
