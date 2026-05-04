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
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/40 dark:to-indigo-900/40 flex items-center justify-center mb-6 shadow-lg shadow-violet-500/10">
        <ClipboardList className="w-10 h-10 text-violet-500 dark:text-violet-400" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">
        No hay tareas aún
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-8">
        Comienza creando tu primera tarea para organizar tu día. Puedes añadir título, descripción, prioridad y fecha límite.
      </p>
      <Button
        onClick={onCreateClick}
        className="rounded-xl px-6 py-2.5 text-sm font-semibold shadow-lg shadow-violet-500/20 hover:shadow-xl hover:shadow-violet-500/30 transition-all bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 border-0 text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        Crear primera tarea
      </Button>
    </motion.div>
  );
}
