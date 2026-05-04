"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Clock, Pencil, Trash2, GripVertical, Plus, ChevronDown, ChevronRight, ArrowUpFromLine } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

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

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onAddSubtask?: (parentId: number) => void;
  onPromoteSubtask?: (subtaskId: number) => void;
  subtasks?: Task[];
  isDragOverlay?: boolean;
}

const statusConfig = {
  pending: { 
    label: "Pendiente", 
    variant: "secondary" as const, 
    color: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800/60",
    dot: "bg-amber-500"
  },
  in_progress: { 
    label: "En progreso", 
    variant: "default" as const, 
    color: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-800/60",
    dot: "bg-indigo-500"
  },
  completed: { 
    label: "Completada", 
    variant: "outline" as const, 
    color: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800/60",
    dot: "bg-emerald-500"
  },
};

const priorityConfig = {
  low: { 
    label: "Baja", 
    color: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700" 
  },
  medium: { 
    label: "Media", 
    color: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-800/60" 
  },
  high: { 
    label: "Alta", 
    color: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-800/60" 
  },
};

export function TaskCard({ task, onEdit, onDelete, onAddSubtask, onPromoteSubtask, subtasks = [], isDragOverlay }: TaskCardProps) {
  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority];
  const [showSubtasks, setShowSubtasks] = useState(false);

  const hasSubtasks = subtasks.length > 0;

  return (
    <motion.div
      whileHover={isDragOverlay ? undefined : { y: -4, transition: { type: "spring", stiffness: 400, damping: 20 } }}
      whileTap={isDragOverlay ? undefined : { scale: 0.98 }}
    >
      <Card className={`group relative rounded-2xl border bg-card shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${isDragOverlay ? 'shadow-2xl ring-2 ring-primary/20 rotate-2 scale-105' : 'border-border hover:border-primary/30'}`}>
        {/* Color accent bar */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${status.dot}`} />
        
        <CardHeader className="pb-3 pl-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              <GripVertical className="w-4 h-4 text-muted-foreground mt-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
              <div className="min-w-0">
                <CardTitle className="text-base font-semibold text-card-foreground truncate leading-tight">
                  {task.title}
                </CardTitle>
                {task.description && (
                  <CardDescription className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {task.description}
                  </CardDescription>
                )}
              </div>
            </div>
            <div className="flex gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary"
                onClick={() => onEdit(task)}
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(task)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-3 pt-0 pl-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={status.variant}
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${status.color}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${status.dot}`} />
              {status.label}
            </Badge>
            <Badge
              variant="outline"
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${priority.color}`}
            >
              {priority.label}
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="pt-0 text-xs text-muted-foreground flex items-center justify-between pl-5">
          <div className="flex items-center gap-3">
            {task.dueDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {format(new Date(task.dueDate), "dd MMM", { locale: es })}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {format(new Date(task.createdAt), "dd MMM", { locale: es })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onAddSubtask && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-primary hover:text-primary hover:bg-primary/10 rounded-lg font-medium"
                onClick={() => onAddSubtask(task.id)}
              >
                <Plus className="w-3 h-3 mr-1" />
                Subtarea
              </Button>
            )}
            {hasSubtasks && (
              <button
                onClick={() => setShowSubtasks(!showSubtasks)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {showSubtasks ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
                {subtasks.length} {subtasks.length === 1 ? "subtarea" : "subtareas"}
              </button>
            )}
          </div>
        </CardFooter>

        {/* Subtasks */}
        {hasSubtasks && showSubtasks && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-6 pb-4 pl-5"
          >
            <div className="border-l-2 border-primary/20 pl-4 space-y-2 mt-1">
              {subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  className="flex items-center justify-between py-2 px-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors group/subtask"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        subtask.status === "completed"
                          ? "bg-emerald-500"
                          : subtask.status === "in_progress"
                          ? "bg-indigo-500"
                          : "bg-amber-500"
                      }`}
                    />
                    <span className="text-sm text-foreground truncate">{subtask.title}</span>
                  </div>
                  <div className="flex gap-1 shrink-0 opacity-0 group-hover/subtask:opacity-100 transition-opacity">
                    {onPromoteSubtask && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded text-primary hover:text-primary hover:bg-primary/10"
                        title="Promover a tarea"
                        onClick={() => onPromoteSubtask(subtask.id)}
                      >
                        <ArrowUpFromLine className="w-3 h-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded text-muted-foreground hover:text-foreground hover:bg-secondary"
                      onClick={() => onEdit(subtask)}
                    >
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(subtask)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
