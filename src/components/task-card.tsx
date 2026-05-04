"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Clock, Pencil, Trash2, GripVertical } from "lucide-react";
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
  createdAt: string;
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const statusConfig = {
  pending: { label: "Pendiente", variant: "secondary" as const, color: "bg-amber-50 text-amber-700 border-amber-200" },
  in_progress: { label: "En progreso", variant: "default" as const, color: "bg-blue-50 text-blue-700 border-blue-200" },
  completed: { label: "Completada", variant: "outline" as const, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

const priorityConfig = {
  low: { label: "Baja", color: "bg-slate-100 text-slate-600" },
  medium: { label: "Media", color: "bg-orange-50 text-orange-700" },
  high: { label: "Alta", color: "bg-rose-50 text-rose-700" },
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const status = statusConfig[task.status];
  const priority = priorityConfig[task.priority];

  return (
    <Card className="group relative rounded-2xl border border-slate-200/60 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <GripVertical className="w-4 h-4 text-slate-300 mt-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
            <div className="min-w-0">
              <CardTitle className="text-base font-semibold text-slate-900 truncate leading-tight">
                {task.title}
              </CardTitle>
              {task.description && (
                <CardDescription className="text-sm text-slate-500 mt-1 line-clamp-2">
                  {task.description}
                </CardDescription>
              )}
            </div>
          </div>
          <div className="flex gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              onClick={() => onEdit(task)}
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
              onClick={() => onDelete(task)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3 pt-0">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={status.variant}
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${status.color}`}
          >
            {status.label}
          </Badge>
          <Badge
            variant="outline"
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${priority.color}`}
          >
            {priority.label}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="pt-0 text-xs text-slate-400 flex items-center gap-3">
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
      </CardFooter>
    </Card>
  );
}
