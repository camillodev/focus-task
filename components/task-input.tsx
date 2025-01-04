'use client'

import { useState, useEffect } from 'react'
import { useParams, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar, MoreHorizontal, ChevronDown, Flag } from 'lucide-react'
import { useTaskStore, getPriorityDetails } from '@/lib/store'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface TaskInputProps {
  defaultProject: string | null
}

export function TaskInput({ defaultProject }: TaskInputProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [priority, setPriority] = useState<1 | 2 | 3 | 4>(4)
  const [projectId, setProjectId] = useState<string | null>(defaultProject)
  const addTask = useTaskStore((state) => state.addTask)
  const projects = useTaskStore((state) => state.projects)
  const params = useParams()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === '/') {
      setDueDate(new Date())
    } else if (pathname === '/inbox') {
      setProjectId(null)
    } else if (pathname.startsWith('/project/')) {
      setProjectId(params.id as string)
    }
  }, [pathname, params])

  const handleSubmit = () => {
    if (title.trim()) {
      addTask({
        title,
        description,
        projectId: projectId === 'inbox' ? null : projectId,
        dueDate,
        priority,
      })
      setTitle('')
      setDescription('')
      setDueDate(pathname === '/' ? new Date() : undefined)
      setPriority(4)
      setProjectId(defaultProject)
      setIsExpanded(false)
    }
  }

  const priorityDetails = getPriorityDetails(priority)

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 px-2 text-sm hover:text-foreground"
          onClick={() => setIsExpanded(true)}
        >
          <span className="mr-2">+</span>
          Adicionar tarefa
        </Button>
      </div>
      {isExpanded && (
        <div className="rounded-lg border bg-card p-4">
          <Input
            placeholder="Nome da tarefa"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-0 bg-transparent p-0 text-sm placeholder:text-muted-foreground focus-visible:ring-0"
            autoFocus
          />
          <Textarea
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-0 bg-transparent p-0 text-sm placeholder:text-muted-foreground focus-visible:ring-0"
          />
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="sm" variant="outline" className="h-7 gap-1">
                    <Calendar className="h-4 w-4" />
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
                  <Button size="sm" variant="outline" className="h-7 gap-1">
                    <Flag className={cn("h-4 w-4", priorityDetails.textColor)} />
                    P{priority}
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="flex flex-col">
                    {[1, 2, 3, 4].map((p) => {
                      const details = getPriorityDetails(p as 1 | 2 | 3 | 4)
                      return (
                        <Button
                          key={p}
                          size="sm"
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
              <Select 
                value={projectId || 'inbox'} 
                onValueChange={(value) => setProjectId(value === 'inbox' ? null : value)}
              >
                <SelectTrigger className="w-[180px]">
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
              <Button size="sm" variant="ghost" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsExpanded(false)}
              >
                Cancelar
              </Button>
              <Button 
                size="sm" 
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={handleSubmit}
              >
                Adicionar tarefa
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

