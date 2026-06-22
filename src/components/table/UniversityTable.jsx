import { useState, Fragment } from "react";
import { ArrowUpDown, ExternalLink, ChevronDown, ChevronRight, Plus, Pencil, Trash2 } from "lucide-react";
import { statusConfig } from "@/lib/statusConfig";
import { daysRemaining, formatDeadline } from "@/lib/dateUtils";

export default function UniversityTable({ universities, onRowClick, onAddProgram, onEdit, onDelete }) {
  const [sortKey, setSortKey] = useState("deadline");
  const [sortDir, setSortDir] = useState("asc");
  const [expandedGroups, setExpandedGroups] = useState({});

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const isExpanded = (groupName) => !!expandedGroups[groupName];

  const toggleGroup = (groupName, e) => {
    e.stopPropagation();
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const getDeadlineColor = (deadline) => {
    if (!deadline) return "text-muted-foreground/40";
    if (deadline.startsWith("9999-12-31")) return "text-purple-400 font-semibold";
    const days = daysRemaining(deadline);
    if (days === null) return "text-muted-foreground/40";
    if (days < 0) return "text-red-500/90";
    if (days <= 14) return "text-red-400 font-medium";
    if (days <= 30) return "text-amber-400 font-medium";
    return "text-emerald-400/90";
  };

  // Group universities by name (trimmed, case-insensitive)
  const groupsMap = {};
  universities.forEach((uni) => {
    const key = (uni.name || "").trim().toLowerCase();
    if (!groupsMap[key]) {
      groupsMap[key] = {
        name: (uni.name || "").trim() || "Unnamed University",
        country: uni.country || "",
        items: [],
      };
    }
    groupsMap[key].items.push(uni);
  });

  const groups = Object.values(groupsMap);

  // Sort items within each group
  groups.forEach((group) => {
    group.items.sort((a, b) => {
      let av = a[sortKey];
      let bv = b[sortKey];
      if (sortKey === "deadline") {
        av = av || "9999-12-32";
        bv = bv || "9999-12-32";
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    group.representative = group.items[0];
  });

  // Sort the groups themselves based on their representative item
  groups.sort((a, b) => {
    let av = a.representative[sortKey];
    let bv = b.representative[sortKey];
    if (sortKey === "deadline") {
      av = av || "9999-12-32";
      bv = bv || "9999-12-32";
    }
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const SortHeader = ({ label, sortKeyName, align = "left", className = "" }) => (
    <th
      className={`px-4 py-3 text-[10px] uppercase tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none ${
        align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left"
      } ${className}`}
      onClick={() => handleSort(sortKeyName)}
    >
      <span className={`flex items-center gap-1 ${
        align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start"
      }`}>
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
            <SortHeader label="Status" sortKeyName="status" align="center" />
            <th className="px-4 py-3 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
              Portal
            </th>
            <th className="px-4 py-3 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => {
            const hasMultiple = group.items.length > 1;

            if (!hasMultiple) {
              // Render standard flat row for single-program universities
              const uni = group.items[0];
              const days = daysRemaining(uni.deadline);
              const cfg = statusConfig[uni.status] || statusConfig.researching;

              const parts = uni.country ? uni.country.split(' ') : [];
              const flag = parts.length > 1 && /[\uD83C][\uDDE6-\uDDFF][\uD83C][\uDDE6-\uDDFF]|[\uD83C][\uDF00-\uDFFF]/.test(parts[parts.length - 1]) ? parts.pop() : '';
              const countryName = parts.join(' ') || uni.country;

              return (
                <tr
                  key={uni.id}
                  onClick={() => onRowClick(uni)}
                  className="h-[72px] border-b border-border/50 hover:bg-secondary/40 cursor-pointer transition-colors group even:bg-muted/10"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-base font-bold tracking-wide text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {uni.name}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddProgram && onAddProgram(uni);
                        }}
                        title="Add another program for this university"
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1 h-4">
                      {uni.program || " "}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground/70 text-[10px] uppercase tracking-wider">
                    <div className="flex items-center h-full">
                      {flag && <span className="text-base mr-2">{flag}</span>}
                      <span className="line-clamp-1">{countryName}</span>
                    </div>
                  </td>
                  <td className={`px-4 py-3 text-xs ${getDeadlineColor(uni.deadline)}`}>
                    {formatDeadline(uni.deadline)}
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
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center justify-center gap-1.5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider border rounded-md ${cfg.badge}`}
                      style={{ minWidth: "90px" }}
                    >
                      <span className={`w-1.5 h-1.5 ${cfg.dot}`} />
                      {cfg.short}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
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
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            onRowClick(uni);
                          }}
                          className="text-muted-foreground/30 text-[11px] uppercase tracking-wider hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span className="text-lg leading-none mb-0.5">+</span> Add Portal
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-center gap-1.5">
                      <button
                        onClick={() => onEdit && onEdit(uni)}
                        title="Edit Application"
                        className="p-1.5 text-muted-foreground hover:text-primary hover:border-border transition-colors border border-transparent rounded cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete && onDelete(uni)}
                        title="Delete Application"
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:border-border transition-colors border border-transparent rounded cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            }

            // Render Accordion layout for multi-program universities
            const rep = group.representative;
            const repDays = daysRemaining(rep.deadline);
            const repCfg = statusConfig[rep.status] || statusConfig.researching;

            const parts = group.country ? group.country.split(' ') : [];
            const flag = parts.length > 1 && /[\uD83C][\uDDE6-\uDDFF][\uD83C][\uDDE6-\uDDFF]|[\uD83C][\uDF00-\uDFFF]/.test(parts[parts.length - 1]) ? parts.pop() : '';
            const countryName = parts.join(' ') || group.country;
            const expanded = isExpanded(group.name);

            return (
              <Fragment key={`group-${group.name}`}>
                {/* Parent Row */}
                <tr
                  onClick={(e) => toggleGroup(group.name, e)}
                  className="h-[72px] border-b border-border bg-secondary/15 hover:bg-secondary/25 cursor-pointer transition-colors group"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => toggleGroup(group.name, e)}
                        className="text-muted-foreground hover:text-foreground p-0.5 transition-colors cursor-pointer"
                      >
                        {expanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      <span className="font-display text-base font-bold tracking-wide text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {group.name}
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground bg-secondary border border-border px-2 py-0.5 rounded font-semibold font-mono select-none">
                        {group.items.length} Programs
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground/60 mt-0.5 line-clamp-1 h-4 pl-7">
                      Multiple applications active
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground/70 text-[10px] uppercase tracking-wider">
                    <div className="flex items-center h-full">
                      {flag && <span className="text-base mr-2">{flag}</span>}
                      <span className="line-clamp-1">{countryName}</span>
                    </div>
                  </td>
                  <td className={`px-4 py-3 text-xs ${getDeadlineColor(rep.deadline)}`}>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground/40 mr-1.5 font-mono">Next:</span>
                    {formatDeadline(rep.deadline)}
                  </td>
                  <td className="px-4 py-3">
                    {repDays !== null ? (
                      <span
                        className={`text-xs font-semibold tabular-nums ${
                          repDays < 0
                            ? "text-red-500"
                            : repDays <= 14
                              ? "text-red-400"
                              : repDays <= 30
                                ? "text-amber-400"
                                : "text-emerald-400"
                        }`}
                      >
                        {repDays < 0
                          ? `${Math.abs(repDays)}d ago`
                          : repDays === 0
                            ? "Today"
                            : `${repDays}d`}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center justify-center gap-1.5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider border rounded-md ${repCfg.badge}`}
                      style={{ minWidth: "90px" }}
                    >
                      <span className={`w-1.5 h-1.5 ${repCfg.dot}`} />
                      {repCfg.short}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {/* Empty portal column for parent */}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-center">
                      <button
                        onClick={() => onAddProgram && onAddProgram(rep)}
                        className="text-muted-foreground hover:text-primary transition-colors text-[11px] uppercase tracking-wider flex items-center gap-1 font-semibold cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Program
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Child Rows */}
                {expanded &&
                  group.items.map((uni, index) => {
                    const isLast = index === group.items.length - 1;
                    const connector = isLast ? "└─" : "├─";
                    const days = daysRemaining(uni.deadline);
                    const cfg = statusConfig[uni.status] || statusConfig.researching;

                    return (
                      <tr
                        key={uni.id}
                        onClick={() => onRowClick(uni)}
                        className="h-[52px] border-b border-border/10 bg-[#060606] hover:bg-[#0c0c0c] cursor-pointer transition-colors group"
                      >
                        <td className="pl-12 pr-4 py-2 border-l-2 border-primary/20">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground/30 font-mono text-[13px] select-none">{connector}</span>
                            <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-foreground/80 group-hover:text-primary transition-colors line-clamp-1">
                              {uni.program || "General Application"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2 border-l-2 border-transparent">
                          {/* Empty spacer to align with parent columns */}
                        </td>
                        <td className={`px-4 py-2 text-[11px] font-mono ${getDeadlineColor(uni.deadline)}`}>
                          {formatDeadline(uni.deadline)}
                        </td>
                        <td className="px-4 py-2">
                          {days !== null ? (
                            <span
                              className={`text-[11px] font-medium font-mono tabular-nums ${
                                days < 0
                                  ? "text-red-500/70"
                                  : days <= 14
                                    ? "text-red-400/70"
                                    : days <= 30
                                      ? "text-amber-400/70"
                                      : "text-emerald-400/70"
                              }`}
                            >
                              {days < 0
                                ? `${Math.abs(days)}d ago`
                                : days === 0
                                  ? "Today"
                                  : `${days}d`}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/30 font-mono text-[11px]">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <span
                            className={`inline-flex items-center justify-center gap-1 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider border rounded-md opacity-85 ${cfg.badge}`}
                            style={{ minWidth: "80px" }}
                          >
                            <span className={`w-1 h-1 ${cfg.dot}`} />
                            {cfg.short}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex justify-center">
                            {uni.portal_url ? (
                              <a
                                href={uni.portal_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-muted-foreground hover:text-primary transition-colors"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            ) : (
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRowClick(uni);
                                }}
                                className="text-muted-foreground/25 text-[10px] uppercase tracking-wider hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <span className="text-lg leading-none mb-0.5">+</span> Add Portal
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-center gap-1">
                            <button
                              onClick={() => onEdit && onEdit(uni)}
                              title="Edit Application"
                              className="p-1 text-muted-foreground hover:text-primary hover:border-border transition-colors border border-transparent rounded cursor-pointer"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => onDelete && onDelete(uni)}
                              title="Delete Application"
                              className="p-1 text-muted-foreground hover:text-destructive hover:border-border transition-colors border border-transparent rounded cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </Fragment>
            );
          })}
          {groups.length === 0 && (
            <tr>
              <td
                colSpan={7}
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



