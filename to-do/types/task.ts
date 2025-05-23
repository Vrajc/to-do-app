export type Priority = "low" | "medium" | "high"
export type Status = "todo" | "in-progress" | "completed"

export interface Task {
  _id: string
  title: string
  description: string
  priority: Priority
  status: Status
  dueDate: Date | null
  createdAt?: Date
  updatedAt?: Date
}
