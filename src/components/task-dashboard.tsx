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
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  Command as CommandIcon,
  Moon,
  Sun,
  MoreHorizontal,
  ArrowUpFromLine,
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useDroppable,
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
import { TaskForm } from "@/components/task-form";
import { SubtaskForm } from "@/components/subtask-form";
import { DeleteDialog } from "@/components/delete-dialog";
import { useTheme } from "@/components/theme-provider";
import {
  createTask,
  updateTask,
  deleteTask,
  reorderTask,
  moveTask,
  updateTaskStatus,
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

const COLUMNS = [
  { id: "pending", title: "Pendientes", color: "from-amber-500 to-orange-500", dot: "bg-amber-500" },
  { id: "in_progress", title: "En progreso", color: "from-blue-500 to-indigo-500", dot: "bg-indigo-500" },
  { id: "completed", title: "Completadas", color: "from-emerald-500 to-teal-500", dot: "bg-emerald-500" },
] as const;

function KanbanCard({
  task,
  subtasks,
  onEdit,
  onDelete,
  onAddSubtask,
  onPromoteSubtask,
  onToggleComplete,
  isOverlay,
}: {
  task: Task;
  subtasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onAddSubtask: (parentId: number) => void;
  onPromoteSubtask: (subtaskId: number) => void;
  onToggleComplete: (task: Task) => void;
  isOverlay?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { status: task.status } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const hasSubtasks = subtasks.length > 0;
  const completedSubtasks = subtasks.filter((s) => s.status === "completed").length;

  const priorityColors = {
    low: "bg-slate-400",
    medium: "bg-orange-400",
    high: "bg-rose-400",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`touch-none ${isDragging ? "opacity-30" : ""}`}
    >
      <motion.div
        layout
        whileHover={isOverlay ? undefined : { y: -2, transition: { duration: 0.15 } }}
        className={`group relative bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow p-3.5 cursor-grab active:cursor-grabbing ${
          isOverlay ? "shadow-2xl rotate-2 scale-105 ring-2 ring-primary/20" : ""
        }`}
      >
        {/* Priority bar */}
        <div className={`absolute left-0 top-2 bottom-2 w-1 rounded-full ${priorityColors[task.priority]}`} />
        
        <div className="pl-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleComplete(task);
                }}
                className="shrink-0 mt-0.5 p-0.5 rounded hover:bg-secondary transition-colors"
                title={task.status === "completed" ? "Marcar como pendiente" : "Marcar como completada"}
              >
                {task.status === "completed" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Circle className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                )}
              </button>
              <h3 className={`text-sm font-medium leading-snug line-clamp-2 flex-1 ${task.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {task.title}
              </h3>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground shrink-0"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Description preview */}
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {task.description}
            </p>
          )}

          {/* Subtasks indicator */}
          {hasSubtasks && (
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${(completedSubtasks / subtasks.length) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">
                {completedSubtasks}/{subtasks.length}
              </span>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1.5">
              {task.dueDate && (
                <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {new Date(task.dueDate).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddSubtask(task.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-secondary text-muted-foreground hover:text-primary"
                title="Agregar subtarea"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                title="Eliminar"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Subtasks list */}
          {hasSubtasks && (
            <div className="mt-2 pt-2 border-t border-border space-y-1">
              {subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  className="flex items-center gap-2 py-1 px-1.5 rounded-lg hover:bg-secondary/50 group/subtask"
                >
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      const newStatus = subtask.status === "completed" ? "pending" : "completed";
                      await updateTaskStatus(subtask.id, newStatus);
                      toast.success(newStatus === "completed" ? "Subtarea completada" : "Subtarea pendiente");
                    }}
                    className="shrink-0"
                  >
                    {subtask.status === "completed" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </button>
                  <span className={`text-xs flex-1 truncate ${subtask.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {subtask.title}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPromoteSubtask(subtask.id);
                    }}
                    className="opacity-0 group-hover/subtask:opacity-100 transition-opacity p-0.5 rounded hover:bg-secondary text-muted-foreground"
                    title="Convertir a tarea"
                  >
                    <ArrowUpFromLine className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function KanbanColumn({
  column,
  tasks,
  allTasks,
  onEdit,
  onDelete,
  onAddSubtask,
  onPromoteSubtask,
  onToggleComplete,
  onAddTask,
}: {
  column: typeof COLUMNS[number];
  tasks: Task[];
  allTasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onAddSubtask: (parentId: number) => void;
  onPromoteSubtask: (subtaskId: number) => void;
  onToggleComplete: (task: Task) => void;
  onAddTask: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id, data: { columnId: column.id } });

  return (
    <div className="flex flex-col w-full min-w-[300px] max-w-[350px]">
      {/* Column header */}
      <div className="flex items-center justify-between px-1 mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${column.dot}`} />
          <h2 className="text-sm font-semibold text-foreground">
            {column.title}
          </h2>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={onAddTask}
          className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Column content - droppable area */}
      <div
        ref={setNodeRef}
        className={`flex-1 rounded-xl transition-colors ${isOver ? "bg-primary/5 ring-2 ring-primary/20" : ""}`}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2 min-h-[100px] p-1">
            <AnimatePresence mode="popLayout">
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <KanbanCard
                    task={task}
                    subtasks={allTasks.filter((t) => t.parentId === task.id)}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onAddSubtask={onAddSubtask}
                    onPromoteSubtask={onPromoteSubtask}
                    onToggleComplete={onToggleComplete}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </SortableContext>
      </div>

      {/* Add card button */}
      <button
        onClick={onAddTask}
        className="mt-2 flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all w-full"
      >
        <Plus className="w-4 h-4" />
        <span>Añade una tarjeta</span>
      </button>
    </div>
  );
}

export function TaskDashboard({ initialTasks }: TaskDashboardProps) {
  const { theme, toggleTheme } = useTheme();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [commandOpen, setCommandOpen] = useState(false);
  const [activeDragId, setActiveDragId] = useState<number | null>(null);

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<string>("pending");
  const [isSubtaskFormOpen, setIsSubtaskFormOpen] = useState(false);
  const [parentTaskId, setParentTaskId] = useState<number | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // Keyboard shortcut
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

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (task.parentId !== null) return false;
    if (!searchQuery) return true;
    return (
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );
  });

  const getColumnTasks = (status: string) =>
    filteredTasks.filter((t) => t.status === status);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as number);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (!over) return;

    const draggedId = active.id as number;
    const draggedTask = tasks.find((t) => t.id === draggedId);
    if (!draggedTask) return;

    // Check if dropped over a column (string id like "pending", "in_progress", "completed")
    const columnId = over.data.current?.columnId || (typeof over.id === "string" ? over.id : null);
    const overTask = tasks.find((t) => t.id === (over.id as number));

    // Dropped over a column area (not over another card)
    if (columnId && COLUMNS.some((c) => c.id === columnId) && draggedTask.status !== columnId) {
      try {
        await updateTaskStatus(draggedId, columnId);
        setTasks((prev) =>
          prev.map((t) => (t.id === draggedId ? { ...t, status: columnId as Task["status"] } : t))
        );
        toast.success(`Movido a ${COLUMNS.find((c) => c.id === columnId)?.title}`);
      } catch (error) {
        toast.error("Error al mover");
      }
      return;
    }

    // Dropped over another card
    if (overTask && draggedId !== overTask.id) {
      // Same column -> reorder
      if (draggedTask.status === overTask.status && draggedTask.parentId === overTask.parentId) {
        const columnTasks = getColumnTasks(draggedTask.status);
        const oldIndex = columnTasks.findIndex((t) => t.id === draggedId);
        const newIndex = columnTasks.findIndex((t) => t.id === overTask.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newColumnTasks = arrayMove(columnTasks, oldIndex, newIndex);
          const otherTasks = tasks.filter((t) => t.status !== draggedTask.status || t.parentId !== null);
          setTasks([...otherTasks, ...newColumnTasks]);

          try {
            await Promise.all(
              newColumnTasks.map((task, index) => reorderTask(task.id, index))
            );
          } catch (error) {
            toast.error("Error al reordenar");
          }
        }
        return;
      }

      // Different column -> move status
      if (draggedTask.status !== overTask.status) {
        try {
          await updateTaskStatus(draggedId, overTask.status);
          setTasks((prev) =>
            prev.map((t) => (t.id === draggedId ? { ...t, status: overTask.status } : t))
          );
          toast.success(`Movido a ${COLUMNS.find((c) => c.id === overTask.status)?.title}`);
        } catch (error) {
          toast.error("Error al mover");
        }
        return;
      }

      // Make subtask
      if (draggedTask.parentId === null && overTask.parentId === null) {
        try {
          await moveTask(draggedId, overTask.id);
          setTasks((prev) =>
            prev.map((t) => (t.id === draggedId ? { ...t, parentId: overTask.id } : t))
          );
          toast.success(`Convertido a subtarea`);
        } catch (error) {
          toast.error("Error al convertir");
        }
        return;
      }
    }
  };

  const serializeTask = (task: any): Task => ({
    ...task,
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    createdAt: task.createdAt ? task.createdAt.toISOString() : new Date().toISOString(),
  });

  const handleCreateTask = async (formData: FormData) => {
    try {
      const newTask = await createTask(formData);
      setTasks((prev) => [...prev, serializeTask(newTask)]);
      toast.success("Tarea creada");
    } catch (error) {
      toast.error("Error al crear");
    }
  };

  const handleUpdateTask = async (formData: FormData) => {
    if (!editingTask) return;
    try {
      const updated = await updateTask(editingTask.id, formData);
      setTasks((prev) =>
        prev.map((t) => (t.id === updated.id ? serializeTask(updated) : t))
      );
      toast.success("Tarea actualizada");
      setIsFormOpen(false);
    } catch (error) {
      toast.error("Error al actualizar");
    }
  };

  const handleCreateSubtask = async (formData: FormData) => {
    if (!parentTaskId) return;
    try {
      const newSubtask = await createTask(formData);
      setTasks((prev) => [...prev, serializeTask(newSubtask)]);
      toast.success("Subtarea creada");
      setIsSubtaskFormOpen(false);
    } catch (error) {
      toast.error("Error al crear subtarea");
    }
  };

  const handleDeleteTask = async () => {
    if (!deletingTask) return;
    try {
      await deleteTask(deletingTask.id);
      setTasks((prev) => prev.filter((t) => t.id !== deletingTask.id));
      toast.success("Tarea eliminada");
      setIsDeleteOpen(false);
      setDeletingTask(null);
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  const handlePromoteSubtask = async (subtaskId: number) => {
    try {
      const updated = await moveTask(subtaskId, null);
      setTasks((prev) =>
        prev.map((t) => (t.id === updated.id ? serializeTask(updated) : t))
      );
      toast.success("Subtarea promovida");
    } catch (error) {
      toast.error("Error al promover");
    }
  };

  const handleToggleComplete = async (task: Task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    try {
      await updateTaskStatus(task.id, newStatus);
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
      );
      toast.success(newStatus === "completed" ? "Tarea completada" : "Tarea pendiente");
    } catch (error) {
      toast.error("Error al actualizar estado");
    }
  };

  const openCreateForm = useCallback((status?: string) => {
    setEditingTask(null);
    setDefaultStatus(status || "pending");
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

  const activeDragTask = activeDragId ? tasks.find((t) => t.id === activeDragId) : null;

  const commandActions = [
    {
      label: "Crear nueva tarea",
      icon: Plus,
      action: () => { setCommandOpen(false); openCreateForm(); },
    },
    {
      label: "Ver pendientes",
      icon: Circle,
      action: () => { setCommandOpen(false); setSearchQuery(""); },
    },
    {
      label: "Limpiar búsqueda",
      icon: Trash2,
      action: () => { setCommandOpen(false); setSearchQuery(""); },
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="shrink-0 bg-card/80 backdrop-blur-xl border-b border-border z-30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/20">
              <span className="text-white font-bold text-sm">TF</span>
            </div>
            <h1 className="text-base font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              TaskFlow
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                className="pl-8 h-8 w-56 rounded-lg bg-secondary/80 border-0 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-muted-foreground"
              onClick={toggleTheme}
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-muted-foreground text-xs"
              onClick={() => setCommandOpen(true)}
            >
              <CommandIcon className="w-3 h-3" />
              <kbd className="hidden lg:inline bg-secondary px-1 rounded text-[10px]">Ctrl K</kbd>
            </Button>
            <Button
              onClick={() => openCreateForm()}
              size="sm"
              className="h-8 rounded-lg text-xs font-semibold bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 border-0 text-white shadow-md shadow-violet-500/20"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              <span className="hidden sm:inline">Nueva</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="h-full min-w-fit px-4 sm:px-6 py-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 h-full">
              {COLUMNS.map((column) => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  tasks={getColumnTasks(column.id)}
                  allTasks={tasks}
                  onEdit={openEditForm}
                  onDelete={openDeleteDialog}
                  onAddSubtask={openSubtaskForm}
                  onPromoteSubtask={handlePromoteSubtask}
                  onToggleComplete={handleToggleComplete}
                  onAddTask={() => openCreateForm(column.id)}
                />
              ))}
            </div>

            <DragOverlay>
              {activeDragTask ? (
                <KanbanCard
                  task={activeDragTask}
                  subtasks={tasks.filter((t) => t.parentId === activeDragTask.id)}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  onAddSubtask={() => {}}
                  onPromoteSubtask={() => {}}
                  onToggleComplete={() => {}}
                  isOverlay
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </main>

      {/* Command Palette */}
      <Dialog open={commandOpen} onOpenChange={setCommandOpen}>
        <DialogContent className="p-0 gap-0 overflow-hidden border-0 shadow-2xl max-w-xl">
          <DialogTitle className="sr-only">Menú de comandos</DialogTitle>
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
                {filteredTasks.map((task) => (
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
        defaultStatus={defaultStatus}
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
