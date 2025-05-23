"use client"

import { useState, useEffect } from "react"
import { DragDropContext, type DropResult } from "@hello-pangea/dnd"
import { TaskColumn } from "@/components/task-column"
import { TaskForm } from "@/components/task-form"
import { TaskFilter } from "@/components/task-filter"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import type { Task, Status } from "@/types/task"
import { fetchTasks, createTask, updateTask, deleteTask } from "@/lib/api"

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState({
    priority: "all",
    status: "all",
    search: "",
  })

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasks()
        setTasks(data)
      } catch (error) {
        console.error("Failed to fetch tasks:", error)
      }
    }

    loadTasks()
  }, [])

  useEffect(() => {
    let result = [...tasks]

    if (filter.priority !== "all") {
      result = result.filter((task) => task.priority === filter.priority)
    }

    if (filter.status !== "all") {
      result = result.filter((task) => task.status === filter.status)
    }

    if (filter.search) {
      const searchLower = filter.search.toLowerCase()
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) || task.description.toLowerCase().includes(searchLower),
      )
    }

    setFilteredTasks(result)
  }, [tasks, filter])

  const handleAddTask = async (newTask: Omit<Task, "_id">) => {
    try {
      const createdTask = await createTask(newTask)
      setTasks([...tasks, createdTask])
      setIsFormOpen(false)
    } catch (error) {
      console.error("Failed to create task:", error)
    }
  }

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      await updateTask(updatedTask)
      setTasks(tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task)))
      setEditingTask(null)
      setIsFormOpen(false)
    } catch (error) {
      console.error("Failed to update task:", error)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId)
      setTasks(tasks.filter((task) => task._id !== taskId))
    } catch (error) {
      console.error("Failed to delete task:", error)
    }
  }

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    // Find the task that was dragged
    const task = tasks.find((t) => t._id === draggableId)
    if (!task) return

    // Update the task status based on the destination column
    const newStatus = destination.droppableId as Status
    const updatedTask = { ...task, status: newStatus }

    // Update the task in the database
    await handleUpdateTask(updatedTask)
  }

  const openEditForm = (task: Task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  const getTasksByStatus = (status: Status) => {
    return filteredTasks.filter((task) => task.status === status)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Task Board</h1>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button onClick={() => setIsFormOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      <TaskFilter filter={filter} setFilter={setFilter} />

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <TaskColumn
            title="To Do"
            tasks={getTasksByStatus("todo")}
            status="todo"
            onEdit={openEditForm}
            onDelete={handleDeleteTask}
          />
          <TaskColumn
            title="In Progress"
            tasks={getTasksByStatus("in-progress")}
            status="in-progress"
            onEdit={openEditForm}
            onDelete={handleDeleteTask}
          />
          <TaskColumn
            title="Completed"
            tasks={getTasksByStatus("completed")}
            status="completed"
            onEdit={openEditForm}
            onDelete={handleDeleteTask}
          />
        </div>
      </DragDropContext>

      {isFormOpen && (
        <TaskForm
          onSubmit={editingTask ? handleUpdateTask : handleAddTask}
          onCancel={() => {
            setIsFormOpen(false)
            setEditingTask(null)
          }}
          task={editingTask}
        />
      )}
    </div>
  )
}
