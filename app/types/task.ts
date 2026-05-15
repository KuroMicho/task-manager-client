export type Priority = "high" | "medium" | "low";

export interface Task {
  _id: string;
  title: string;
  priority: Priority;
  createdAt: string;
  commentCount?: number;
}
