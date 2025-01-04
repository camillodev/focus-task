'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { useTaskStore } from '@/lib/store'
import { TaskList } from '@/components/task-list'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const tasks = useTaskStore((state) => state.tasks)

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="h-full">
      <header className="flex h-14 items-center border-b px-4">
        <h1 className="text-xl font-semibold">Buscar</h1>
      </header>
      <div className="p-4">
        <Input
          type="text"
          placeholder="Buscar tarefas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4"
        />
        <TaskList tasks={filteredTasks} />
      </div>
    </div>
  )
}

