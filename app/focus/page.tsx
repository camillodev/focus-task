'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTaskStore } from '@/lib/store'
import { FocusMode } from '@/components/focus-mode'
import { FocusModeButton } from '@/components/focus-mode-button'

export default function FocusModePage() {
  const router = useRouter()
  const tasks = useTaskStore((state) => state.tasks)
  const uncompletedTasks = tasks.filter(task => !task.completed)

  useEffect(() => {
    if (uncompletedTasks.length === 0) {
      router.push('/')
    }
  }, [uncompletedTasks, router])

  return (
    <>
      <div className="flex items-center justify-between h-14 border-b px-4">
        <h1 className="text-xl font-semibold">Focus Mode</h1>
        <FocusModeButton />
      </div>
      <div className="container mx-auto p-4">
        <FocusMode tasks={uncompletedTasks} />
      </div>
    </>
  )
}

