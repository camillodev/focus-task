'use client'

import { TaskList } from '@/components/task-list'
import { TaskInput } from '@/components/task-input'
import { useTaskStore } from '@/lib/store'
import { useMemo } from 'react'

export default function InboxPage() {
  const tasks = useTaskStore((state) => state.tasks)
  
  const inboxTasks = useMemo(() => {
    return tasks.filter(task => task.project === null)
  }, [tasks])

  return (
    <div className="h-full">
      <header className="flex h-14 items-center border-b px-4">
        <h1 className="text-xl font-semibold">Entrada</h1>
        <span className="ml-2 text-sm text-muted-foreground">
          {inboxTasks.length} {inboxTasks.length === 1 ? 'tarefa' : 'tarefas'}
        </span>
      </header>
      <div className="p-4">
        <TaskList tasks={inboxTasks} />
        <TaskInput defaultProject={null} />
      </div>
    </div>
  )
}

