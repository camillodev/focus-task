'use client'

import { TaskList } from '@/components/task-list'
import { TaskInput } from '@/components/task-input'
import { useTaskStore } from '@/lib/store'
import { useMemo } from 'react'

export default function Home() {
  const tasks = useTaskStore((state) => state.tasks)
  
  const todayTasks = useMemo(() => {
    const today = new Date().toDateString()
    return tasks.filter(task => task.dueDate && new Date(task.dueDate).toDateString() === today)
  }, [tasks])

  return (
    <div className="h-full">
      <header className="flex h-14 items-center border-b px-4">
        <h1 className="text-xl font-semibold">Hoje</h1>
        <span className="ml-2 text-sm text-muted-foreground">
          {todayTasks.length} {todayTasks.length === 1 ? 'tarefa' : 'tarefas'}
        </span>
      </header>
      <div className="p-4">
        <TaskList tasks={todayTasks} />
        <TaskInput defaultProject={null} />
      </div>
    </div>
  )
}

