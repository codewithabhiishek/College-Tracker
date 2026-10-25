import { useState, useEffect } from "react";
import { LayoutGrid, Table2, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/clerk-react";
import { haptics } from "@/lib/haptics";

export default function AppHeader({
  view,
  setView,
  onToggleGlobalDocs,
  showGlobalDocs,
}) {
  const { user } = useUser();
  const rawName = user?.firstName || "Abhishek";
  const firstName = rawName.toUpperCase();

  const [glitchText, setGlitchText] = useState("COLLEGETRACK");

  useEffect(() => {
    const chars = "!<>-_\\\\/[]{}—=+*^?#_";
    const target = "COLLEGETRACK";
    let iteration = 0;
    
    const interval = setInterval(() => {
      setGlitchText((prev) =>
        prev
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return target[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= target.length) {
        clearInterval(interval);
      }
      iteration += 1 / 2;
    }, 30);

    return () => clearInterval(interval);
  }, []);

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

  const handleViewChange = (newView) => {
    haptics.select();
    setView(newView);
  };

  const handleToggleDocs = () => {
    haptics.tap();
    onToggleGlobalDocs();
  };

  return (
    <header className="border-b border-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-primary" />
        <h1 className="font-display text-lg font-bold tracking-tight uppercase">
          {glitchText}<span className="text-primary animate-pulse">_</span>
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
        <a
          href="https://abhiishek.is-a.dev/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => haptics.tap()}
          className="hidden lg:inline-flex items-center gap-1 text-[10px] font-mono tracking-widest text-muted-foreground hover:text-primary transition-colors border border-border px-2.5 py-1.5 uppercase hover:border-primary/50"
          title="Creator Portfolio"
        >
          <span>BY ABHISHEK</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
        <Button
          variant={showGlobalDocs ? "default" : "outline"}
          size="sm"
          onClick={handleToggleDocs}
          className="text-xs uppercase tracking-wider gap-1.5 h-8"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Shared Docs</span>
        </Button>
        <div className="flex border border-border">
          <button
            onClick={() => handleViewChange("table")}
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
            onClick={() => handleViewChange("kanban")}
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
            onClick={() => handleViewChange("calendar")}
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
