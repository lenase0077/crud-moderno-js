"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq, isNull, asc } from "drizzle-orm";

export async function getTasks() {
  return db.select().from(tasks).where(isNull(tasks.parentId)).orderBy(asc(tasks.sortOrder)).all();
}

export async function getAllTasks() {
  return db.select().from(tasks).orderBy(asc(tasks.sortOrder)).all();
}

export async function getSubtasks(parentId: number) {
  return db.select().from(tasks).where(eq(tasks.parentId, parentId)).orderBy(asc(tasks.sortOrder)).all();
}

export async function getTaskById(id: number) {
  return db.select().from(tasks).where(eq(tasks.id, id)).get();
}

export async function createTask(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = (formData.get("priority") as string) || "medium";
  const status = (formData.get("status") as string) || "pending";
  const dueDateRaw = formData.get("dueDate") as string;
  const parentIdRaw = formData.get("parentId") as string;

  if (!title || title.trim().length === 0) {
    throw new Error("El título es obligatorio");
  }

  const parentId = parentIdRaw ? parseInt(parentIdRaw) : null;

  const result = await db.insert(tasks).values({
    title: title.trim(),
    description: description?.trim() || null,
    priority: priority as "low" | "medium" | "high",
    status: status as "pending" | "in_progress" | "completed",
    dueDate: dueDateRaw ? new Date(dueDateRaw) : null,
    parentId,
  }).returning().get();

  revalidatePath("/");
  return result;
}

export async function updateTask(id: number, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as string;
  const status = formData.get("status") as string;
  const dueDateRaw = formData.get("dueDate") as string;

  if (!title || title.trim().length === 0) {
    throw new Error("El título es obligatorio");
  }

  const result = await db.update(tasks).set({
    title: title.trim(),
    description: description?.trim() || null,
    priority: priority as "low" | "medium" | "high",
    status: status as "pending" | "in_progress" | "completed",
    dueDate: dueDateRaw ? new Date(dueDateRaw) : null,
  }).where(eq(tasks.id, id)).returning().get();

  revalidatePath("/");
  return result;
}

export async function updateTaskStatus(id: number, status: string) {
  await db.update(tasks).set({
    status: status as "pending" | "in_progress" | "completed",
  }).where(eq(tasks.id, id));

  revalidatePath("/");
}

export async function reorderTask(id: number, newSortOrder: number) {
  await db.update(tasks).set({ sortOrder: newSortOrder }).where(eq(tasks.id, id));
  revalidatePath("/");
}

export async function moveTask(id: number, newParentId: number | null) {
  const result = await db.update(tasks).set({ parentId: newParentId }).where(eq(tasks.id, id)).returning().get();
  revalidatePath("/");
  return result;
}

export async function deleteTask(id: number) {
  await db.delete(tasks).where(eq(tasks.id, id));
  revalidatePath("/");
}
