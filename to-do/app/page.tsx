import TaskBoard from "@/components/task-board"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="todo-theme">
      <main className="min-h-screen bg-background">
        <TaskBoard />
      </main>
    </ThemeProvider>
  )
}
