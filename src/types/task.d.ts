// src/types/task.d.ts

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedTo?: string;
  read?: boolean;
  priority: TaskPriority;
}

export interface TaskData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
}
export type TaskStatus = "pending" | "completed" | "in-progress";
export type TaskPriority = "low" | "medium" | "high";
