import { Task } from '../types'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface TaskItemProps {
  task: Task
  onToggle: () => void
  onDelete: () => void
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <li className="flex items-center justify-between p-2 bg-white rounded shadow">
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={task.completed}
          onCheckedChange={onToggle}
        />
        <span className={task.completed ? 'line-through text-gray-500' : ''}>
          {task.title}
        </span>
      </div>
      <Button variant="ghost" size="icon" onClick={onDelete}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </li>
  )
}

