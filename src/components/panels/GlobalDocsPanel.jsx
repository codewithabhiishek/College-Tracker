import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, X, FileText } from "lucide-react";

export default function GlobalDocsPanel({
  docs,
  onToggle,
  onAdd,
  onDelete,
  onClose,
}) {
  const [newName, setNewName] = useState("");
  const readyCount = docs.filter((d) => d.is_ready).length;

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAdd(newName.trim());
    setNewName("");
  };

  return (
    <div className="w-full md:w-[300px] border-l border-border bg-card flex-shrink-0 flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-display font-medium">
            Shared Documents
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-primary tabular-nums font-semibold">
            {readyCount}/{docs.length}
          </span>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors md:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center gap-2 px-3 py-2 border border-border bg-background group"
          >
            <Checkbox
              checked={doc.is_ready}
              onCheckedChange={() => onToggle(doc)}
            />
            <span
              className={`text-xs flex-1 ${doc.is_ready ? "line-through text-muted-foreground" : "text-foreground"}`}
            >
              {doc.doc_name}
            </span>
            <button
              onClick={() => onDelete(doc.id)}
              className="text-muted-foreground/30 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
        {docs.length === 0 && (
          <p className="text-[10px] text-muted-foreground/40 uppercase tracking-widest text-center py-8">
            No shared documents yet
          </p>
        )}
      </div>

      <div className="p-3 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Add document..."
            className="text-xs bg-background border-border"
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), handleAdd())
            }
          />
          <Button
            size="sm"
            variant="outline"
            onClick={handleAdd}
            disabled={!newName.trim()}
            className="text-xs"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
