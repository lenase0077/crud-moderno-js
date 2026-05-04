"use client";

import { ClipboardList, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onCreateClick: () => void;
}

export function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-6">
        <ClipboardList className="w-10 h-10 text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        No hay tareas aún
      </h3>
      <p className="text-sm text-slate-500 max-w-sm mb-8">
        Comienza creando tu primera tarea para organizar tu día. Puedes añadir título, descripción, prioridad y fecha límite.
      </p>
      <Button
        onClick={onCreateClick}
        className="rounded-xl px-6 py-2.5 shadow-sm hover:shadow-md transition-all"
      >
        <Plus className="w-4 h-4 mr-2" />
        Crear primera tarea
      </Button>
    </div>
  );
}
