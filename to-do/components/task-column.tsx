"use client"

import { Droppable, Draggable } from "@hello-pangea/dnd"
import type { Task, Status } from "@/types/task"
import { TaskCard } from "@/components/task-card"

interface TaskColumnProps {
  title: string
  tasks: Task[]
  status: Status
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
}

export function TaskColumn({ title, tasks, status, onEdit, onDelete }: TaskColumnProps) {
  return (
    <div className="bg-card rounded-lg shadow-sm p-4">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <Droppable droppableId={status}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="min-h-[300px]">
            {tasks.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="mb-3"
                  >
                    <TaskCard task={task} onEdit={() => onEdit(task)} onDelete={() => onDelete(task._id)} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
