import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, X, FileText, Pencil, Check } from "lucide-react";

export default function GlobalDocsPanel({
  docs,
  onToggle,
  onAdd,
  onUpdate,
  onDelete,
  onClose,
}) {
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const readyCount = docs.filter((d) => d.is_ready).length;

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAdd(newName.trim().toUpperCase());
    setNewName("");
  };

  const handleSaveEdit = () => {
    const trimmed = editingName.trim().toUpperCase();
    if (trimmed && trimmed !== docs.find((d) => d.id === editingId)?.doc_name) {
      onUpdate(editingId, trimmed);
    }
    setEditingId(null);
  };

  return (
    <div className="fixed md:relative inset-y-0 right-0 z-50 md:z-auto w-full md:w-[300px] border-l border-border bg-card flex-shrink-0 flex flex-col h-full shadow-2xl md:shadow-none">
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
            className="flex items-center gap-2 px-3 py-2 border border-border bg-background group h-[42px]"
          >
            <Checkbox
              checked={doc.is_ready}
              onCheckedChange={() => onToggle(doc)}
            />
            
            {editingId === doc.id ? (
              <Input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value.toUpperCase())}
                onBlur={handleSaveEdit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit();
                  if (e.key === "Escape") setEditingId(null);
                }}
                className="text-xs flex-1 h-7 bg-background border-border uppercase py-0 px-2 font-display"
                autoFocus
              />
            ) : (
              <span
                className={`text-xs flex-1 truncate uppercase font-display tracking-wider ${
                  doc.is_ready ? "line-through text-muted-foreground" : "text-foreground"
                }`}
              >
                {doc.doc_name}
              </span>
            )}

            {editingId === doc.id ? (
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSaveEdit();
                }}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="flex items-center">
                <button
                  onClick={() => {
                    setEditingId(doc.id);
                    setEditingName(doc.doc_name);
                  }}
                  className="text-muted-foreground/30 hover:text-primary transition-colors opacity-0 group-hover:opacity-100 p-1 cursor-pointer"
                >
                  <Pencil className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onDelete(doc.id)}
                  className="text-muted-foreground/30 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )}
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
            onChange={(e) => setNewName(e.target.value.toUpperCase())}
            placeholder="Add document..."
            className="text-xs bg-background border-border uppercase tracking-wider"
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
