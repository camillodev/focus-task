'use client'

import { Button } from '@/components/ui/button'
import { Focus } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { useTaskStore } from '@/lib/store'

export function FocusModeButton() {
  const router = useRouter()
  const pathname = usePathname()
  const tasks = useTaskStore((state) => state.tasks)
  const projects = useTaskStore((state) => state.projects)

  let uncompletedTasks = tasks.filter(task => !task.completed)

  // Filter tasks based on the current page
  if (pathname === '/') {
    uncompletedTasks = uncompletedTasks.filter(task => task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString())
  } else if (pathname === '/inbox') {
    uncompletedTasks = uncompletedTasks.filter(task => task.projectId === null)
  } else if (pathname.startsWith('/project/')) {
    const projectId = pathname.split('/').pop()
    uncompletedTasks = uncompletedTasks.filter(task => task.projectId === projectId)
  }

  const handleClick = () => {
    if (uncompletedTasks.length > 0) {
      router.push('/focus')
    }
  }

  return (
    <Button
      variant="default"
      size="sm"
      onClick={handleClick}
      disabled={uncompletedTasks.length === 0}
      className="bg-primary text-primary-foreground hover:bg-primary/90"
    >
      <Focus className="mr-2 h-4 w-4" />
      Focus Mode
    </Button>
  )
}

