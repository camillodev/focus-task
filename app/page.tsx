'use client'

import { TaskList } from '@/components/task-list'
import { TaskInput } from '@/components/task-input'
import { useTaskStore } from '@/lib/store'
import { useMemo } from 'react'
import { FocusModeButton } from '@/components/focus-mode-button'

export default function Home() {
  const tasks = useTaskStore((state) => state.tasks)
  
  const todayTasks = useMemo(() => {
    const today = new Date().toDateString()
    return tasks.filter(task => task.dueDate && new Date(task.dueDate).toDateString() === today)
  }, [tasks])

  return (
    <>
      <div className="flex items-center justify-between h-14 border-b px-4">
        <h1 className="text-xl font-semibold">Hoje</h1>
        <FocusModeButton />
      </div>
      <div className="p-4">
        <TaskList tasks={todayTasks} />
        <TaskInput defaultProject={null} />
      </div>
    </>
  )
}

