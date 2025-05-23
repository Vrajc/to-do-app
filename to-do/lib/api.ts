import type { Task } from "@/types/task"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(`${API_URL}/tasks`, {
    cache: "no-store",
  })
  if (!response.ok) {
    throw new Error("Failed to fetch tasks")
  }
  return response.json()
}

export async function createTask(task: Omit<Task, "_id">): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  })
  if (!response.ok) {
    throw new Error("Failed to create task")
  }
  return response.json()
}

export async function updateTask(task: Task): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks/${task._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  })
  if (!response.ok) {
    throw new Error("Failed to update task")
  }
  return response.json()
}

export async function deleteTask(taskId: string): Promise<void> {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete task")
  }
}
