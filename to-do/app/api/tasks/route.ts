import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Task from "@/models/Task"

export async function GET() {
  try {
    await connectToDatabase()
    const tasks = await Task.find().sort({ createdAt: -1 })
    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    const body = await request.json()

    const task = new Task({
      title: body.title,
      description: body.description,
      priority: body.priority || "medium",
      status: body.status || "todo",
      dueDate: body.dueDate || null,
    })

    const savedTask = await task.save()
    return NextResponse.json(savedTask, { status: 201 })
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
