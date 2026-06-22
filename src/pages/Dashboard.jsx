import { useState, useMemo } from "react";
// Removed base44 import
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

import AppHeader from "@/components/layout/AppHeader";
import SummaryStats from "@/components/stats/SummaryStats";
import UniversityTable from "@/components/table/UniversityTable";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import CalendarView from "@/components/calendar/CalendarView";
import UniversityFormModal from "@/components/modals/UniversityFormModal";

import GlobalDocsPanel from "@/components/panels/GlobalDocsPanel";
import { useAuth } from "@clerk/clerk-react";

export default function Dashboard() {
  const [view, setView] = useState("table");
  const [formOpen, setFormOpen] = useState(false);
  const [showGlobalDocs, setShowGlobalDocs] = useState(false);
  const [editingUni, setEditingUni] = useState(null);
  const [prefillUni, setPrefillUni] = useState(null);
  const [initialDate, setInitialDate] = useState(null);

  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  // Fetch Universities
  const { data: universities = [], refetch: refetchUnis, isLoading: unisIsLoading } = useQuery({
    queryKey: ["universities"],
    queryFn: async () => {
      const token = await getToken();
      const res = await fetch("/api/universities", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch universities");
      return res.json();
    },
  });

  // Fetch Global Documents
  const { data: globalDocs = [], isLoading: docsIsLoading } = useQuery({
    queryKey: ["globalDocs"],
    queryFn: async () => {
      const token = await getToken();
      const res = await fetch("/api/documents", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch documents");
      return res.json();
    },
  });

  // Mutations
  const createUni = useMutation({
    mutationFn: async (data) => {
      const token = await getToken();
      const res = await fetch("/api/universities", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create");
      return res.json();
    },
    onMutate: async (newUni) => {
      await queryClient.cancelQueries({ queryKey: ["universities"] });
      const previousUnis = queryClient.getQueryData(["universities"]);
      const tempId = `temp-${Math.random()}`;
      queryClient.setQueryData(["universities"], (old = []) => [
        ...old,
        { id: tempId, ...newUni, created_at: new Date().toISOString() },
      ]);
      setFormOpen(false);
      setEditingUni(null);
      setPrefillUni(null);
      setInitialDate(null);
      return { previousUnis };
    },
    onError: (err, newUni, context) => {
      if (context?.previousUnis) {
        queryClient.setQueryData(["universities"], context.previousUnis);
      }
      toast.error("Failed to add university");
      setFormOpen(true);
    },
    onSuccess: () => {
      toast.success("University added");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["universities"] });
    },
  });

  const updateUni = useMutation({
    mutationFn: async (data) => {
      const token = await getToken();
      const res = await fetch("/api/universities", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onMutate: async (updatedUni) => {
      await queryClient.cancelQueries({ queryKey: ["universities"] });
      const previousUnis = queryClient.getQueryData(["universities"]);
      queryClient.setQueryData(["universities"], (old = []) =>
        old.map((uni) => (uni.id === updatedUni.id ? { ...uni, ...updatedUni } : uni))
      );
      setFormOpen(false);
      setEditingUni(null);
      setPrefillUni(null);
      setInitialDate(null);
      return { previousUnis };
    },
    onError: (err, updatedUni, context) => {
      if (context?.previousUnis) {
        queryClient.setQueryData(["universities"], context.previousUnis);
      }
      toast.error("Failed to update university");
      setFormOpen(true);
    },
    onSuccess: () => {
      toast.success("University updated");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["universities"] });
    },
  });

  const deleteUni = useMutation({
    mutationFn: async (id) => {
      const token = await getToken();
      const res = await fetch("/api/universities", {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["universities"] });
      const previousUnis = queryClient.getQueryData(["universities"]);
      queryClient.setQueryData(["universities"], (old = []) =>
        old.filter((uni) => uni.id !== id)
      );
      return { previousUnis };
    },
    onError: (err, id, context) => {
      if (context?.previousUnis) {
        queryClient.setQueryData(["universities"], context.previousUnis);
      }
      toast.error("Failed to delete university");
    },
    onSuccess: () => {
      toast.success("University deleted");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["universities"] });
    },
  });

  // GlobalDoc mutations
  const createGlobalDoc = useMutation({
    mutationFn: async (/** @type {any} */ data) => {
      const token = await getToken();
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create document");
      return res.json();
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["globalDocs"] }),
  });

  const updateGlobalDoc = useMutation({
    mutationFn: async (/** @type {{id: string, data: any}} */ { id, data }) => {
      const token = await getToken();
      const res = await fetch("/api/documents", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id, ...data }),
      });
      if (!res.ok) throw new Error("Failed to update document");
      return res.json();
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["globalDocs"] });
      const previousDocs = queryClient.getQueryData(["globalDocs"]);
      queryClient.setQueryData(["globalDocs"], (old = []) =>
        old.map((doc) => (doc.id === id ? { ...doc, ...data } : doc))
      );
      return { previousDocs };
    },
    onError: (err, newDoc, context) => {
      if (context?.previousDocs) {
        queryClient.setQueryData(["globalDocs"], context.previousDocs);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["globalDocs"] });
    },
  });

  const deleteGlobalDoc = useMutation({
    mutationFn: async (id) => {
      const token = await getToken();
      const res = await fetch("/api/documents", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete document");
      return res.json();
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["globalDocs"] }),
  });

  // Handlers
  const handleRowClick = (uni) => {
    setEditingUni(uni);
    setPrefillUni(null);
    setFormOpen(true);
  };

  const handleDateSelect = (date) => {
    // Make sure we pass an ISO string without timezone shifts
    const localIso = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
    setEditingUni(null);
    setInitialDate(localIso);
    setFormOpen(true);
  };

  const handleSaveUni = (data) => {
    if (editingUni) {
      updateUni.mutate({ id: editingUni.id, ...data });
    } else {
      createUni.mutate(data);
    }
  };

  const handleAddProgram = (uni) => {
    setEditingUni(null);
    setInitialDate(null);
    setPrefillUni({ name: uni.name, country: uni.country, deadline: uni.deadline });
    setFormOpen(true);
  };

  const handleEditUni = (uni) => {
    setEditingUni(uni);
    setFormOpen(true);
  };

  const handleDeleteUniDirect = (uni) => {
    if (confirm(`Are you sure you want to delete ${uni.program || "this application"} at ${uni.name}?`)) {
      deleteUni.mutate(uni.id);
    }
  };





  const [statusFilter, setStatusFilter] = useState(null);

  const filteredUnis = useMemo(() => {
    if (!statusFilter) return universities;
    return universities.filter(u => u.status === statusFilter);
  }, [universities, statusFilter]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader
        view={view}
        setView={setView}
        showGlobalDocs={showGlobalDocs}
        onToggleGlobalDocs={() => setShowGlobalDocs((s) => !s)}
      />
      <SummaryStats 
        universities={universities} 
        globalDocs={globalDocs}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Action bar */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-border">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-display">
              /02 {view === "table" ? "Table View" : view === "kanban" ? "Kanban View" : "Calendar View"}
            </span>
            <Button
              size="sm"
              onClick={() => {
                setEditingUni(null);
                setFormOpen(true);
              }}
              className="text-xs uppercase tracking-wider gap-1.5 h-8"
            >
              <Plus className="w-3.5 h-3.5" />
              Add University
            </Button>
          </div>

          {/* Content */}
          <main className="flex-1 overflow-hidden relative">
          {(unisIsLoading || docsIsLoading) ? (
            <div className="p-6 flex flex-col h-full space-y-4 select-none">
              {/* Table search + filter bar skeleton */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border border-border/40 p-4 bg-card/10">
                <div className="h-8 bg-secondary/40 w-full sm:w-64 animate-pulse animate-shimmer" />
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="h-8 bg-secondary/40 w-full sm:w-28 animate-pulse animate-shimmer" />
                  <div className="h-8 bg-secondary/40 w-full sm:w-28 animate-pulse animate-shimmer" />
                </div>
              </div>

              {/* Table skeleton */}
              <div className="border border-border bg-card/15 flex-1 flex flex-col overflow-hidden">
                {/* Table Header skeleton */}
                <div className="grid grid-cols-6 border-b border-border bg-secondary/20 px-6 py-3.5 text-[10px] uppercase font-display tracking-widest text-muted-foreground/50">
                  <div>University</div>
                  <div>Program</div>
                  <div>Country</div>
                  <div>Deadline</div>
                  <div>Status</div>
                  <div className="text-center">Portal</div>
                </div>

                {/* Table Rows skeleton */}
                <div className="flex-1 divide-y divide-border/40 overflow-hidden">
                  {[...Array(6)].map((_, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: idx * 0.06 }}
                      className="grid grid-cols-6 px-6 py-4 items-center animate-shimmer"
                    >
                      <div className="h-4 bg-secondary/40 rounded-sm w-3/4 animate-pulse" />
                      <div className="h-4 bg-secondary/35 rounded-sm w-5/6 animate-pulse" />
                      <div className="h-3 bg-secondary/30 rounded-sm w-12 animate-pulse" />
                      <div className="h-3.5 bg-secondary/30 rounded-sm w-16 animate-pulse" />
                      
                      {/* Status badge skeleton */}
                      <div className="h-5 border border-border/30 bg-secondary/20 rounded-none w-20 flex items-center px-2 gap-1.5 animate-pulse">
                        <div className="w-1.5 h-1.5 bg-secondary/45 rounded-full" />
                        <div className="h-2 bg-secondary/35 rounded-sm w-10" />
                      </div>

                      {/* Portal icon skeleton */}
                      <div className="h-4 bg-secondary/30 rounded-sm w-4 justify-self-center animate-pulse" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {view === "table" && (
                <UniversityTable
                  universities={filteredUnis}
                  onRowClick={handleRowClick}
                  onAddProgram={handleAddProgram}
                  onDelete={handleDeleteUniDirect}
                />
              )}
              {view === "kanban" && (
                <KanbanBoard
                  universities={filteredUnis}
                  onCardClick={handleRowClick}
                />
              )}
              {view === "calendar" && (
                <CalendarView
                  universities={filteredUnis}
                  onEventClick={handleRowClick}
                  onDateSelect={handleDateSelect}
                />
              )}
            </>
          )}
        </main>
        </div>

        {/* Global docs panel */}
        {showGlobalDocs && (
          <GlobalDocsPanel
            docs={globalDocs}
            onToggle={(doc) =>
              updateGlobalDoc.mutate({
                id: doc.id,
                data: { is_ready: !doc.is_ready },
              })
            }
            onAdd={(name) =>
              createGlobalDoc.mutate({
                university_id: "global",
                doc_name: name,
                is_ready: false,
              })
            }
            onUpdate={(id, name) =>
              updateGlobalDoc.mutate({
                id,
                data: { doc_name: name },
              })
            }
            onDelete={(id) => deleteGlobalDoc.mutate(id)}
            onClose={() => setShowGlobalDocs(false)}
          />
        )}
      </div>

      {/* Modals */}
      <UniversityFormModal
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) {
            setPrefillUni(null);
          }
        }}
        university={editingUni}
        prefillUni={prefillUni}
        onSave={handleSaveUni}
        isSaving={createUni.isPending || updateUni.isPending}
        initialDate={initialDate}
      />


    </div>
  );
}
