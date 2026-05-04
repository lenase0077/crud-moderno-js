"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "cmdk";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  Command as CommandIcon,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/empty-state";
import { TaskCard } from "@/components/task-card";
import { TaskForm } from "@/components/task-form";
import { SubtaskForm } from "@/components/subtask-form";
import { DeleteDialog } from "@/components/delete-dialog";
import {
  createTask,
  updateTask,
  deleteTask,
  reorderTask,
} from "@/app/actions";

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: string | null;
  parentId: number | null;
  sortOrder: number;
  createdAt: string;
}

interface TaskDashboardProps {
  initialTasks: Task[];
}

function SortableTaskCard({
  task,
  onEdit,
  onDelete,
  onAddSubtask,
  subtasks,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onAddSubtask: (parentId: number) => void;
  subtasks: Task[];
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
        onAddSubtask={onAddSubtask}
        subtasks={subtasks}
      />
    </div>
  );
}

export function TaskDashboard({ initialTasks }: TaskDashboardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [isSubtaskFormOpen, setIsSubtaskFormOpen] = useState(false);
  const [parentTaskId, setParentTaskId] = useState<number | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const [commandOpen, setCommandOpen] = useState(false);

  // Keyboard shortcut for Command Palette
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Filter top-level tasks only
  const topLevelTasks = tasks.filter((t) => t.parentId === null);

  const filteredTasks = topLevelTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filteredTasks.findIndex((t) => t.id === active.id);
    const newIndex = filteredTasks.findIndex((t) => t.id === over.id);

    const newTasks = arrayMove(filteredTasks, oldIndex, newIndex);
    setTasks((prev) => {
      const others = prev.filter((t) => t.parentId !== null || !filteredTasks.find((ft) => ft.id === t.id));
      return [...newTasks, ...others];
    });

    try {
      await Promise.all(
        newTasks.map((task, index) => reorderTask(task.id, index))
      );
      toast.success("Orden actualizado");
    } catch (error) {
      toast.error("Error al reordenar");
    }
  };

  // Subtasks helper
  const getSubtasks = (parentId: number) =>
    tasks.filter((t) => t.parentId === parentId);

  const handleCreateTask = async (formData: FormData) => {
    try {
      await createTask(formData);
      toast.success("Tarea creada exitosamente");
      window.location.reload();
    } catch (error) {
      toast.error("Error al crear la tarea");
    }
  };

  const handleUpdateTask = async (formData: FormData) => {
    if (!editingTask) return;
    try {
      await updateTask(editingTask.id, formData);
      toast.success("Tarea actualizada");
      window.location.reload();
    } catch (error) {
      toast.error("Error al actualizar");
    }
  };

  const handleCreateSubtask = async (formData: FormData) => {
    if (!parentTaskId) return;
    try {
      await createTask(formData);
      toast.success("Subtarea creada");
      setIsSubtaskFormOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error("Error al crear subtarea");
    }
  };

  const handleDeleteTask = async () => {
    if (!deletingTask) return;
    try {
      await deleteTask(deletingTask.id);
      toast.success("Tarea eliminada");
      setIsDeleteOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error("Error al eliminar");
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

  const openSubtaskForm = useCallback((parentId: number) => {
    setParentTaskId(parentId);
    setIsSubtaskFormOpen(true);
  }, []);

  const openDeleteDialog = useCallback((task: Task) => {
    setDeletingTask(task);
    setIsDeleteOpen(true);
  }, []);

  const taskCounts = {
    all: topLevelTasks.length,
    pending: topLevelTasks.filter((t) => t.status === "pending").length,
    in_progress: topLevelTasks.filter((t) => t.status === "in_progress").length,
    completed: topLevelTasks.filter((t) => t.status === "completed").length,
  };

  const commandActions = [
    {
      label: "Crear nueva tarea",
      icon: Plus,
      action: () => {
        setCommandOpen(false);
        openCreateForm();
      },
    },
    {
      label: "Ver todas las tareas",
      icon: LayoutGrid,
      action: () => {
        setCommandOpen(false);
        setStatusFilter("all");
      },
    },
    {
      label: "Ver pendientes",
      icon: Circle,
      action: () => {
        setCommandOpen(false);
        setStatusFilter("pending");
      },
    },
    {
      label: "Ver en progreso",
      icon: Clock,
      action: () => {
        setCommandOpen(false);
        setStatusFilter("in_progress");
      },
    },
    {
      label: "Ver completadas",
      icon: CheckCircle2,
      action: () => {
        setCommandOpen(false);
        setStatusFilter("completed");
      },
    },
    {
      label: "Limpiar búsqueda",
      icon: Trash2,
      action: () => {
        setCommandOpen(false);
        setSearchQuery("");
        setStatusFilter("all");
      },
    },
  ];

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
                onClick={() => setCommandOpen(true)}
              >
                <CommandIcon className="w-3.5 h-3.5" />
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

        {/* Task Grid with Drag & Drop */}
        <AnimatePresence mode="wait">
          {filteredTasks.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <EmptyState onCreateClick={openCreateForm} />
            </motion.div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filteredTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <motion.div
                  key="grid"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.06 },
                    },
                  }}
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                      : "flex flex-col gap-3"
                  }
                >
                  <AnimatePresence>
                    {filteredTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        layout
                        variants={{
                          hidden: { opacity: 0, y: 20, scale: 0.95 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            transition: {
                              type: "spring",
                              stiffness: 350,
                              damping: 25,
                            },
                          },
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.9,
                          transition: { duration: 0.2 },
                        }}
                      >
                        <SortableTaskCard
                          task={task}
                          onEdit={openEditForm}
                          onDelete={openDeleteDialog}
                          onAddSubtask={openSubtaskForm}
                          subtasks={getSubtasks(task.id)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </SortableContext>
            </DndContext>
          )}
        </AnimatePresence>
      </main>

      {/* Command Palette */}
      <Dialog open={commandOpen} onOpenChange={setCommandOpen}>
        <DialogContent className="p-0 gap-0 overflow-hidden border-0 shadow-2xl max-w-xl">
          <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
            <CommandInput placeholder="Buscar acciones o tareas..." />
            <CommandList>
              <CommandEmpty>No se encontraron resultados.</CommandEmpty>
              <CommandGroup heading="Acciones">
                {commandActions.map((action) => (
                  <CommandItem
                    key={action.label}
                    onSelect={action.action}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <action.icon className="w-4 h-4" />
                    {action.label}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Tareas">
                {topLevelTasks.map((task) => (
                  <CommandItem
                    key={task.id}
                    onSelect={() => {
                      setCommandOpen(false);
                      setSearchQuery(task.title);
                    }}
                    className="cursor-pointer"
                  >
                    <span className="truncate">{task.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>

      {/* Modals */}
      <TaskForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        task={editingTask}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
      />

      <SubtaskForm
        open={isSubtaskFormOpen}
        onOpenChange={setIsSubtaskFormOpen}
        parentId={parentTaskId}
        onSubmit={handleCreateSubtask}
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
