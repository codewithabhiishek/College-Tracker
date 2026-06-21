import { useState } from "react";
import { format, parseISO } from "date-fns";
import { ArrowUpDown, ExternalLink } from "lucide-react";
import { statusConfig } from "@/lib/statusConfig";
import { daysRemaining } from "@/lib/dateUtils";

export default function UniversityTable({ universities, onRowClick }) {
  const [sortKey, setSortKey] = useState("deadline");
  const [sortDir, setSortDir] = useState("asc");

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = [...universities].sort((a, b) => {
    let av = a[sortKey];
    let bv = b[sortKey];
    if (sortKey === "deadline") {
      av = av || "9999-12-31";
      bv = bv || "9999-12-31";
    }
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const SortHeader = ({ label, sortKeyName, className = "" }) => (
    <th
      className={`px-4 py-3 text-left text-[10px] uppercase tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none ${className}`}
      onClick={() => handleSort(sortKeyName)}
    >
      <span className="flex items-center gap-1">
        {label}
        <ArrowUpDown
          className={`w-3 h-3 ${sortKey === sortKeyName ? "text-primary" : "text-muted-foreground/40"}`}
        />
      </span>
    </th>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/30">
            <SortHeader label="University / Program" sortKeyName="name" />
            <SortHeader label="Country" sortKeyName="country" />
            <SortHeader label="Deadline" sortKeyName="deadline" />
            <th
              className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-muted-foreground cursor-pointer hover:text-foreground"
              onClick={() => handleSort("deadline")}
            >
              <span className="flex items-center gap-1">
                Days Left
                <ArrowUpDown
                  className={`w-3 h-3 ${sortKey === "deadline" ? "text-primary" : "text-muted-foreground/40"}`}
                />
              </span>
            </th>
            <SortHeader label="Status" sortKeyName="status" />
            <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-muted-foreground">
              Portal
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((uni) => {
            const days = daysRemaining(uni.deadline);
            const cfg = statusConfig[uni.status] || statusConfig.researching;

            return (
              <tr
                key={uni.id}
                onClick={() => onRowClick(uni)}
                className="border-b border-border/50 hover:bg-secondary/40 cursor-pointer transition-colors group"
              >
                <td className="px-4 py-3">
                  <div className="font-display font-medium text-foreground group-hover:text-primary transition-colors">
                    {uni.name}
                  </div>
                  {uni.program && (
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {uni.program}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs uppercase tracking-wider">
                  {uni.country}
                </td>
                <td className="px-4 py-3 text-xs">
                  {uni.deadline
                    ? format(parseISO(uni.deadline), "dd MMM yyyy")
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  {days !== null ? (
                    <span
                      className={`text-xs font-semibold tabular-nums ${
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
                  ) : (
                    <span className="text-muted-foreground/40">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] uppercase tracking-wider border ${cfg.badge}`}
                  >
                    <span className={`w-1.5 h-1.5 ${cfg.dot}`} />
                    {cfg.short}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {uni.portal_url ? (
                    <a
                      href={uni.portal_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground/20">—</span>
                  )}
                </td>
              </tr>
            );
          })}
          {sorted.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-12 text-center text-muted-foreground text-xs uppercase tracking-widest"
              >
                No universities added yet. Click "Add University" to start.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
