"use client";

import { motion } from "framer-motion";
import { ClipboardList, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onCreateClick: () => void;
}

export function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
        <ClipboardList className="w-10 h-10 text-slate-400 dark:text-slate-500" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
        No hay tareas aún
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-8">
        Comienza creando tu primera tarea para organizar tu día. Puedes añadir título, descripción, prioridad y fecha límite.
      </p>
      <Button
        onClick={onCreateClick}
        className="rounded-xl px-6 py-2.5 shadow-sm hover:shadow-md transition-all"
      >
        <Plus className="w-4 h-4 mr-2" />
        Crear primera tarea
      </Button>
    </motion.div>
  );
}
