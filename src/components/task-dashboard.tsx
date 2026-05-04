"use client";

import { useState, useCallback } from "react";
import { Plus, Search, LayoutGrid, List, Command } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/empty-state";
import { TaskCard } from "@/components/task-card";
import { TaskForm } from "@/components/task-form";
import { DeleteDialog } from "@/components/delete-dialog";
import { createTask, updateTask, deleteTask } from "@/app/actions";

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: string | null;
  createdAt: string;
}

interface TaskDashboardProps {
  initialTasks: Task[];
}

export function TaskDashboard({ initialTasks }: TaskDashboardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateTask = async (formData: FormData) => {
    try {
      await createTask(formData);
      toast.success("Tarea creada exitosamente");
      window.location.reload();
    } catch (error) {
      toast.error("Error al crear la tarea");
      console.error(error);
    }
  };

  const handleUpdateTask = async (formData: FormData) => {
    if (!editingTask) return;
    try {
      await updateTask(editingTask.id, formData);
      toast.success("Tarea actualizada exitosamente");
      window.location.reload();
    } catch (error) {
      toast.error("Error al actualizar la tarea");
      console.error(error);
    }
  };

  const handleDeleteTask = async () => {
    if (!deletingTask) return;
    try {
      await deleteTask(deletingTask.id);
      toast.success("Tarea eliminada");
      setIsDeleteOpen(false);
      setDeletingTask(null);
      window.location.reload();
    } catch (error) {
      toast.error("Error al eliminar la tarea");
      console.error(error);
    }
  };

  const openCreateForm = useCallback(() => {
    setEditingTask(null);
    setIsFormOpen(true);
  }, []);

  const openEditForm = useCallback((task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  }, []);

  const openDeleteDialog = useCallback((task: Task) => {
    setDeletingTask(task);
    setIsDeleteOpen(true);
  }, []);

  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  return (
    <div className="min-h-full">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                <span className="text-white font-bold text-sm">TF</span>
              </div>
              <h1 className="text-lg font-semibold text-slate-900">TaskFlow</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex items-center gap-2 text-slate-500 rounded-lg"
              >
                <Command className="w-3.5 h-3.5" />
                <span className="text-xs">Ctrl K</span>
              </Button>
              <Button
                onClick={openCreateForm}
                className="rounded-xl px-4 py-2 text-sm font-medium shadow-sm hover:shadow-md transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva tarea
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar tareas..."
                className="pl-10 rounded-xl w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-lg h-9 w-9"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-lg h-9 w-9"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: `Todas (${taskCounts.all})` },
              { key: "pending", label: `Pendientes (${taskCounts.pending})` },
              { key: "in_progress", label: `En progreso (${taskCounts.in_progress})` },
              { key: "completed", label: `Completadas (${taskCounts.completed})` },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setStatusFilter(filter.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  statusFilter === filter.key
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Task Grid */}
        {filteredTasks.length === 0 ? (
          <EmptyState onCreateClick={openCreateForm} />
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                : "flex flex-col gap-3"
            }
          >
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={openEditForm}
                onDelete={openDeleteDialog}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <TaskForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        task={editingTask}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
      />

      <DeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        taskTitle={deletingTask?.title || ""}
        onConfirm={handleDeleteTask}
      />
    </div>
  );
}
