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

export default function Dashboard() {
  const [view, setView] = useState("table");
  const [showGlobalDocs, setShowGlobalDocs] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedUni, setSelectedUni] = useState(null);
  const [editingUni, setEditingUni] = useState(null);

  const queryClient = useQueryClient();

  // Mock Data Generators
  const getMockUnis = async () => {
    return [
      { id: "1", name: "Johannes Kepler University", country: "Austria", status: "preparing", deadline: "2024-12-01T23:59" },
      { id: "2", name: "University of Innsbruck", country: "Austria", status: "preparing", deadline: "2024-12-01T17:00" },
      { id: "3", name: "University of Salzburg", country: "Austria", status: "researching", deadline: "2025-01-15T12:00" },
      { id: "4", name: "TU Wien", country: "Austria", status: "preparing", deadline: "2025-02-01T23:59" },
      { id: "5", name: "TU Graz", country: "Austria", status: "researching", deadline: "2025-03-01T23:59" },
      { id: "6", name: "University of Klagenfurt", country: "Austria", status: "researching", deadline: "2025-04-01T15:00" },
      { id: "7", name: "University of Padua", country: "Italy", status: "researching", deadline: "2025-04-15T23:59" },
    ];
  };

  const getMockUniDocs = async () => {
    return [];
  };

  const getMockGlobalDocs = async () => {
    return [
      { id: "1", doc_name: "Passport", is_ready: true },
      { id: "2", doc_name: "IELTS", is_ready: false },
      { id: "3", doc_name: "APS", is_ready: false },
      { id: "4", doc_name: "SOP", is_ready: false },
      { id: "5", doc_name: "CV/Resume", is_ready: false },
      { id: "6", doc_name: "LOR", is_ready: false },
    ];
  };

  // Queries
  const { data: universities = [] } = useQuery({
    queryKey: ["universities"],
    queryFn: getMockUnis,
  });

  const { data: uniDocs = [] } = useQuery({
    queryKey: ["uniDocs"],
    queryFn: getMockUniDocs,
  });

  const { data: globalDocs = [] } = useQuery({
    queryKey: ["globalDocs"],
    queryFn: getMockGlobalDocs,
  });

  // Mutations
  const createUni = useMutation({
    mutationFn: async (data) => data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["universities"] });
      setFormOpen(false);
      setEditingUni(null);
    },
  });

  const updateUni = useMutation({
    mutationFn: async ({ id, data }) => data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["universities"] });
      setFormOpen(false);
      setEditingUni(null);
      // refresh detail if open
      if (selectedUni) {
        queryClient.invalidateQueries({ queryKey: ["universities"] });
      }
    },
  });

  const deleteUni = useMutation({
    mutationFn: async (id) => id,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["universities"] });
      queryClient.invalidateQueries({ queryKey: ["uniDocs"] });
      setDetailOpen(false);
      setSelectedUni(null);
    },
  });

  // UniDoc mutations
  const createUniDoc = useMutation({
    mutationFn: async (data) => data,
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

  const handleSaveUni = (data) => {
    if (editingUni) {
      updateUni.mutate({ id: editingUni.id, data });
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader
        view={view}
        setView={setView}
        showGlobalDocs={showGlobalDocs}
        onToggleGlobalDocs={() => setShowGlobalDocs((s) => !s)}
      />
      <SummaryStats universities={universities} globalDocs={globalDocs} />

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
          <div className="flex-1 overflow-auto">
            {view === "table" ? (
              <UniversityTable
                universities={universities}
                onRowClick={handleRowClick}
              />
            ) : view === "kanban" ? (
              <KanbanBoard
                universities={universities}
                onCardClick={handleRowClick}
              />
            ) : (
              <CalendarView
                universities={universities}
                onEventClick={handleRowClick}
              />
            )}
          </div>
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
              createGlobalDoc.mutate({ doc_name: name, is_ready: false })
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
