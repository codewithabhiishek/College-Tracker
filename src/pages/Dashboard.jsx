import { useState } from "react";
// Removed base44 import
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import AppHeader from "@/components/layout/AppHeader";
import SummaryStats from "@/components/stats/SummaryStats";
import UniversityTable from "@/components/table/UniversityTable";
import KanbanBoard from "@/components/kanban/KanbanBoard";
import CalendarView from "@/components/calendar/CalendarView";
import UniversityFormModal from "@/components/modals/UniversityFormModal";
import UniversityDetailModal from "@/components/modals/UniversityDetailModal";
import GlobalDocsPanel from "@/components/panels/GlobalDocsPanel";
import { useAuth } from "@clerk/clerk-react";

export default function Dashboard() {
  const [view, setView] = useState("table");
  const [selectedUni, setSelectedUni] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [showGlobalDocs, setShowGlobalDocs] = useState(false);
  const [editingUni, setEditingUni] = useState(null);

  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  // Fetch Universities
  const { data: universities = [], refetch: refetchUnis } = useQuery({
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
  const { data: globalDocs = [], refetch: refetchDocs } = useQuery({
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

  // Fetch Uni Documents
  const { data: uniDocs = [] } = useQuery({
    queryKey: ["uniDocs"],
    queryFn: async () => {
      const token = await getToken();
      const res = await fetch("/api/university-docs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch uni docs");
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
    onSuccess: () => {
      refetchUnis();
      setFormOpen(false);
      setEditingUni(null);
      setInitialDate(null);
      toast.success("University added");
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
    onSuccess: () => {
      refetchUnis();
      setFormOpen(false);
      setEditingUni(null);
      setInitialDate(null);
      setSelectedUni(null);
      toast.success("University updated");
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
    onSuccess: () => {
      refetchUnis();
      setSelectedUni(null);
      setDetailOpen(false);
      toast.success("University deleted");
    },
  });

  // UniDoc mutations
  const createUniDoc = useMutation({
    mutationFn: async (data) => {
      const token = await getToken();
      const res = await fetch("/api/university-docs", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["uniDocs"] }),
  });

  const updateUniDoc = useMutation({
    mutationFn: async ({ id, data }) => data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["uniDocs"] }),
  });

  const deleteUniDoc = useMutation({
    mutationFn: async (id) => id,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["uniDocs"] }),
  });

  // GlobalDoc mutations
  const createGlobalDoc = useMutation({
    mutationFn: async (data) => data,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["globalDocs"] }),
  });

  const updateGlobalDoc = useMutation({
    mutationFn: async ({ id, data }) => data,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["globalDocs"] }),
  });

  const deleteGlobalDoc = useMutation({
    mutationFn: async (id) => id,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["globalDocs"] }),
  });

  // Handlers
  const handleRowClick = (uni) => {
    setSelectedUni(uni);
    setDetailOpen(true);
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

  const handleEditFromDetail = () => {
    setDetailOpen(false);
    setEditingUni(selectedUni);
    setFormOpen(true);
  };

  const handleDeleteUni = () => {
    if (!selectedUni) return;
    deleteUni.mutate(selectedUni.id);
  };

  const handleAddUniDoc = (docName) => {
    if (!selectedUni) return;
    createUniDoc.mutate({
      university_id: selectedUni.id,
      doc_name: docName,
      is_ready: false,
    });
  };

  const handleToggleUniDoc = (doc) => {
    updateUniDoc.mutate({ id: doc.id, data: { is_ready: !doc.is_ready } });
  };

  const selectedUniDocs = uniDocs.filter(
    (d) => d.university_id === selectedUni?.id,
  );

  // Keep selectedUni in sync with latest data
  const currentSelectedUni = selectedUni
    ? universities.find((u) => u.id === selectedUni.id) || selectedUni
    : null;

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
          {view === "table" && (
            <UniversityTable
              universities={filteredUnis}
              onRowClick={handleRowClick}
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
            onDelete={(id) => deleteGlobalDoc.mutate(id)}
            onClose={() => setShowGlobalDocs(false)}
          />
        )}
      </div>

      {/* Modals */}
      <UniversityFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        university={editingUni}
        onSave={handleSaveUni}
        isSaving={createUni.isPending || updateUni.isPending}
        initialDate={initialDate}
      />

      <UniversityDetailModal
        open={detailOpen}
        onOpenChange={setDetailOpen}
        university={currentSelectedUni}
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteUni}
      />
    </div>
  );
}
