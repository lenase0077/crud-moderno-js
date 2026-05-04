"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const subtaskSchema = z.object({
  title: z.string().min(1, "El título es obligatorio").max(100),
  description: z.string().max(500),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string(),
});

type SubtaskFormData = z.infer<typeof subtaskSchema>;

interface SubtaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentId: number | null;
  onSubmit: (formData: FormData) => Promise<void>;
}

export function SubtaskForm({ open, onOpenChange, parentId, onSubmit }: SubtaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SubtaskFormData>({
    resolver: zodResolver(subtaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
    },
  });

  const onFormSubmit = async (data: SubtaskFormData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("status", "pending");
    formData.append("priority", data.priority);
    formData.append("dueDate", data.dueDate);
    if (parentId) {
      formData.append("parentId", parentId.toString());
    }

    await onSubmit(formData);
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg">Nueva subtarea</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Agregá una subtarea a esta tarea.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5 mt-2">
          <div className="space-y-2">
            <Label htmlFor="subtask-title" className="text-sm font-medium">
              Título <span className="text-destructive">*</span>
            </Label>
            <Input
              id="subtask-title"
              placeholder="Ej: Revisar sección 1"
              className="rounded-xl"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-destructive mt-1">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtask-description" className="text-sm font-medium">
              Descripción
            </Label>
            <Textarea
              id="subtask-description"
              placeholder="Detalles adicionales..."
              className="rounded-xl min-h-[60px] resize-none"
              {...register("description")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Prioridad</Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Prioridad" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtask-dueDate" className="text-sm font-medium">
                Fecha límite
              </Label>
              <Input
                id="subtask-dueDate"
                type="date"
                className="rounded-xl"
                {...register("dueDate")}
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl flex-1 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 border-0 text-white"
            >
              {isSubmitting ? "Guardando..." : "Crear subtarea"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
