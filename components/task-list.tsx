'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { useTaskStore, Task, getPriorityDetails } from '@/lib/store'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Flag, GripVertical, MoreHorizontal, Focus } from 'lucide-react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TaskEditDialog } from '@/components/task-edit-dialog'

interface TaskListProps {
  tasks: Task[]
}

export function TaskList({ tasks }: TaskListProps) {
  const toggleTask = useTaskStore((state) => state.toggleTask)
  const reorderTasks = useTaskStore((state) => state.reorderTasks)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const startFocusMode = useTaskStore((state) => state.startFocusMode)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return

    reorderTasks(result.source.index, result.destination.index)
  }, [reorderTasks])

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-1"
          >
            {tasks.map((task, index) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                index={index}
                onToggle={toggleTask}
                onEdit={() => setEditingTask(task)}
                onDelete={() => deleteTask(task.id)}
                onStartFocus={() => startFocusMode(task.id)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      {editingTask && (
        <TaskEditDialog
          task={editingTask}
          open={!!editingTask}
          onOpenChange={() => setEditingTask(null)}
        />
      )}
    </DragDropContext>
  )
}

interface TaskItemProps {
  task: Task
  index: number
  onToggle: (id: string) => void
  onEdit: () => void
  onDelete: () => void
  onStartFocus: (id: string) => void
}

function TaskItem({ task, index, onToggle, onEdit, onDelete, onStartFocus }: TaskItemProps) {
  const priorityDetails = getPriorityDetails(task.priority)

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            "group flex items-center gap-2 rounded-lg p-2",
            snapshot.isDragging ? "bg-accent" : "hover:bg-accent",
            task.completed && "text-muted-foreground"
          )}
        >
          <div
            {...provided.dragHandleProps}
            className="flex h-6 w-6 items-center justify-center opacity-0 group-hover:opacity-100"
          >
            <GripVertical className="h-4 w-4" />
          </div>
          <Checkbox 
            checked={task.completed} 
            onCheckedChange={() => onToggle(task.id)}
          />
          <Flag className={cn("h-4 w-4", priorityDetails.textColor)} />
          <div className="flex-1">
            <div className={cn("text-sm", task.completed && "line-through")}>
              {task.title}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{task.projectId ? 'Projeto' : 'Entrada'}</span>
              {task.dueDate && (
                <>
                  <span>•</span>
                  <span>{format(new Date(task.dueDate), 'PPP', { locale: ptBR })}</span>
                </>
              )}
              <span>•</span>
              <span className={priorityDetails.textColor}>
                P{task.priority} - {priorityDetails.description}
              </span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>Editar</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStartFocus(task.id)}>
                <Focus className="mr-2 h-4 w-4" />
                Focus Mode
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete}>Excluir</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </Draggable>
  )
}

