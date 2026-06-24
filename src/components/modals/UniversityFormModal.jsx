import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ALL_STATUSES, statusConfig } from "@/lib/statusConfig";

const emptyForm = {
  name: "",
  country: "",
  program: "",
  deadline: "",
  status: "researching",
  portal_url: "",
  application_fee: "",
  fee_paid: false,
  notes: "",
};

const formatUniversityName = (name) => {
  if (!name) return "";
  return name
    .trim()
    .split(/\s+/)
    .map((word) => {
      if (word.length === 0) return "";
      // Handle abbreviations like TU, MIT, USA, etc. (all uppercase, length > 1)
      if (word === word.toUpperCase() && word.length > 1) {
        return word;
      }
      const lower = word.toLowerCase();
      const exceptions = [
        "of",
        "and",
        "in",
        "the",
        "at",
        "for",
        "with",
        "on",
        "by",
        "to",
        "a",
        "an",
        "de",
        "di",
        "la",
        "von",
        "zu",
      ];
      if (exceptions.includes(lower)) {
        return lower;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ")
    // Ensure the very first character of the name is always capitalized
    .replace(/^\w/, (c) => c.toUpperCase());
};

export default function UniversityFormModal({
  open,
  onOpenChange,
  university,
  prefillUni,
  onSave,
  isSaving,
  initialDate,
}) {
  const [form, setForm] = useState(emptyForm);
  const [deadlineType, setDeadlineType] = useState("empty");
  const isEdit = !!university;

  useEffect(() => {
    if (!open) return;

    let initialDeadline = "";
    if (university) {
      initialDeadline = university.deadline ? university.deadline.split('T')[0] : "";
    } else if (prefillUni) {
      initialDeadline = prefillUni.deadline ? prefillUni.deadline.split('T')[0] : (initialDate || "");
    } else {
      initialDeadline = initialDate || "";
    }

    const type = initialDeadline === "9999-12-31"
      ? "not-out"
      : initialDeadline
      ? "custom"
      : "empty";
    setDeadlineType(type);

    setForm({
      name: university?.name || prefillUni?.name || "",
      country: university?.country || prefillUni?.country || "",
      program: university?.program || "",
      deadline: initialDeadline,
      status: university?.status || "researching",
      portal_url: university?.portal_url || "",
      application_fee: university?.application_fee ?? "",
      fee_paid: university?.fee_paid || false,
      notes: university?.notes || "",
    });
  }, [open, university?.id, prefillUni?.name, initialDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...form,
      name: formatUniversityName(form.name),
      application_fee:
        form.application_fee !== "" ? Number(form.application_fee) : null,
      program: form.program || null,
      deadline: form.deadline || null,
      portal_url: form.portal_url || null,
      notes: form.notes || null,
    };
    onSave(data);
  };

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] bg-card border-border p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="font-display text-base uppercase tracking-wider">
            {isEdit ? "Edit University" : "Add University"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Name *
              </Label>
              <Input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
                className="mt-1 bg-background border-border text-sm"
              />
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Country *
              </Label>
              <Select
                value={form.country}
                onValueChange={(v) => update("country", v)}
              >
                <SelectTrigger className="mt-1 bg-background border-border text-sm">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Austria 🇦🇹">Austria 🇦🇹</SelectItem>
                  <SelectItem value="Germany 🇩🇪">Germany 🇩🇪</SelectItem>
                  <SelectItem value="Italy 🇮🇹">Italy 🇮🇹</SelectItem>
                  <SelectItem value="France 🇫🇷">France 🇫🇷</SelectItem>
                  <SelectItem value="USA 🇺🇸">USA 🇺🇸</SelectItem>
                  <SelectItem value="UK 🇬🇧">UK 🇬🇧</SelectItem>
                  <SelectItem value="Switzerland 🇨🇭">Switzerland 🇨🇭</SelectItem>
                  <SelectItem value="Netherlands 🇳🇱">Netherlands 🇳🇱</SelectItem>
                  <SelectItem value="Other 🌍">Other 🌍</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Program
              </Label>
              <Input
                value={form.program}
                onChange={(e) => update("program", e.target.value)}
                className="mt-1 bg-background border-border text-sm"
              />
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Deadline
              </Label>
              <div className="flex flex-col gap-2 mt-1">
                <Select
                  value={deadlineType}
                  onValueChange={(val) => {
                    setDeadlineType(val);
                    if (val === "not-out") {
                      update("deadline", "9999-12-31");
                    } else if (val === "empty") {
                      update("deadline", "");
                    } else {
                      const current = form.deadline;
                      const isValidDate = current && current !== "9999-12-31";
                      update("deadline", isValidDate ? current : new Date().toISOString().split("T")[0]);
                    }
                  }}
                >
                  <SelectTrigger className="w-full bg-background border-border text-xs">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="empty">Not Specified</SelectItem>
                    <SelectItem value="not-out">Not Out Yet</SelectItem>
                    <SelectItem value="custom">Specific Date</SelectItem>
                  </SelectContent>
                </Select>

                {deadlineType === "custom" && (
                  <Input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => update("deadline", e.target.value)}
                    className="w-full bg-background border-border text-sm h-9"
                  />
                )}
              </div>
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Status
              </Label>
              <Select
                value={form.status}
                onValueChange={(v) => update("status", v)}
              >
                <SelectTrigger className="mt-1 bg-background border-border text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      <span className="flex items-center gap-2">
                        <span
                          className={`w-1.5 h-1.5 ${statusConfig[s].dot}`}
                        />
                        {statusConfig[s].label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Portal URL
              </Label>
              <Input
                value={form.portal_url}
                onChange={(e) => update("portal_url", e.target.value)}
                placeholder="https://..."
                className="mt-1 bg-background border-border text-sm"
              />
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                App. Fee
              </Label>
              <Input
                type="number"
                step="0.01"
                value={form.application_fee}
                onChange={(e) => update("application_fee", e.target.value)}
                className="mt-1 bg-background border-border text-sm"
              />
              <div className="flex items-center gap-2 mt-2.5">
                <Checkbox
                  checked={form.fee_paid}
                  onCheckedChange={(v) => update("fee_paid", v)}
                  id="fee_paid"
                />
                <Label
                  htmlFor="fee_paid"
                  className="text-xs text-muted-foreground cursor-pointer select-none"
                >
                  Fee Paid
                </Label>
              </div>
            </div>
          </div>
          <div>
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Notes
            </Label>
            <Textarea
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              className="mt-1 bg-background border-border text-sm min-h-[80px]"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-xs uppercase tracking-wider"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving || !form.name || !form.country}
              className="text-xs uppercase tracking-wider"
            >
              {isSaving ? "Saving..." : isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
