import { getAllTasks } from "@/app/actions";
import { TaskDashboard } from "@/components/task-dashboard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const tasks = await getAllTasks();

  // Serialize dates to strings for client component
  const serializedTasks = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    status: (task.status ?? "pending") as "pending" | "in_progress" | "completed",
    priority: (task.priority ?? "medium") as "low" | "medium" | "high",
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    parentId: task.parentId ?? null,
    sortOrder: task.sortOrder ?? 0,
    createdAt: task.createdAt ? task.createdAt.toISOString() : new Date().toISOString(),
  }));

  return <TaskDashboard initialTasks={serializedTasks} />;
}
