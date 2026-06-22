import { LayoutGrid, Table2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/clerk-react";

export default function AppHeader({
  view,
  setView,
  onToggleGlobalDocs,
  showGlobalDocs,
}) {
  const { user } = useUser();
  const rawName = user?.firstName || "Abhishek";
  const firstName = rawName.toUpperCase();

  const getGreeting = () => {
    const hr = new Date().toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
    });
    const hour = parseInt(hr, 10);
    if (hour < 12) return "GOOD MORNING";
    if (hour < 17) return "GOOD AFTERNOON";
    return "GOOD EVENING";
  };

  const greeting = getGreeting();

  return (
    <header className="border-b border-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-primary" />
        <h1 className="font-display text-lg font-bold tracking-tight uppercase">
          CollegeTrack<span className="text-primary">_</span>
        </h1>
        <div className="flex flex-col ml-2 hidden sm:flex">
          <span className="text-muted-foreground text-[10px] tracking-widest uppercase">
            {greeting}, {firstName}<span className="text-primary font-bold">.</span>
          </span>
          <span className="text-xs font-medium text-foreground">
            {new Intl.DateTimeFormat('en-IN', {
              timeZone: 'Asia/Kolkata',
              dateStyle: 'full'
            }).format(new Date())}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant={showGlobalDocs ? "default" : "outline"}
          size="sm"
          onClick={onToggleGlobalDocs}
          className="text-xs uppercase tracking-wider gap-1.5 h-8"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Shared Docs</span>
        </Button>
        <div className="flex border border-border">
          <button
            onClick={() => setView("table")}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
              view === "table"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Table2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Table</span>
          </button>
          <button
            onClick={() => setView("kanban")}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider flex items-center gap-1.5 border-l border-border transition-colors ${
              view === "kanban"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kanban</span>
          </button>
          <button
            onClick={() => setView("calendar")}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider flex items-center gap-1.5 border-l border-border transition-colors ${
              view === "calendar"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="hidden sm:inline">Calendar</span>
          </button>
        </div>
        <div className="ml-4 pl-4 border-l border-border flex items-center">
          <UserButton afterSignOutUrl="/login" />
        </div>
      </div>
    </header>
  );
}
