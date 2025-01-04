'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar, ChevronDown, Flag } from 'lucide-react'
import { useTaskStore, Task, getPriorityDetails, projectColors } from '@/lib/store'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface TaskEditDialogProps {
  task: Task
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskEditDialog({ task, open, onOpenChange }: TaskEditDialogProps) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
  const [dueDate, setDueDate] = useState<Date | undefined>(task.dueDate)
  const [priority, setPriority] = useState<1 | 2 | 3 | 4>(task.priority)
  const [projectId, setProjectId] = useState<string | null>(task.projectId)
  const editTask = useTaskStore((state) => state.editTask)
  const projects = useTaskStore((state) => state.projects)

  const handleSubmit = () => {
    if (title.trim()) {
      editTask(task.id, {
        title,
        description: description || undefined,
        projectId,
        dueDate,
        priority,
      })
      onOpenChange(false)
    }
  }

  const priorityDetails = getPriorityDetails(priority)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Nome da tarefa"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                  <Calendar className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'PPP', { locale: ptBR }) : 'Data de vencimento'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  locale={ptBR}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                  <Flag className={cn("mr-2 h-4 w-4", priorityDetails.textColor)} />
                  P{priority} - {priorityDetails.description}
                  <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="flex flex-col">
                  {[1, 2, 3, 4].map((p) => {
                    const details = getPriorityDetails(p as 1 | 2 | 3 | 4)
                    return (
                      <Button
                        key={p}
                        variant="ghost"
                        className={cn(
                          "justify-start",
                          priority === p && "bg-accent"
                        )}
                        onClick={() => setPriority(p as 1 | 2 | 3 | 4)}
                      >
                        <Flag className={cn("mr-2 h-4 w-4", details.textColor)} />
                        P{p} - {details.description}
                      </Button>
                    )
                  })}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <Select 
            value={projectId || 'inbox'} 
            onValueChange={(value) => setProjectId(value === 'inbox' ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o projeto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inbox">Entrada</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full bg-${project.color}-500`} />
                    {project.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>Salvar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

