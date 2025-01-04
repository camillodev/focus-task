'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Home, Calendar, Search, FolderPlus, MoreHorizontal } from 'lucide-react'
import { useTaskStore, projectColors } from '@/lib/store'
import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { isToday } from 'date-fns'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function AppSidebar() {
  const pathname = usePathname()
  const tasks = useTaskStore((state) => state.tasks)
  const projects = useTaskStore((state) => state.projects)
  const addProject = useTaskStore((state) => state.addProject)
  const editProject = useTaskStore((state) => state.editProject)
  const deleteProject = useTaskStore((state) => state.deleteProject)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectColor, setNewProjectColor] = useState(projectColors[0].value)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<{ id: string; name: string; color: string } | null>(null)

  const counts = useMemo(() => {
    const inboxCount = tasks.filter(task => task.projectId === null && !task.completed).length
    const todayCount = tasks.filter(task => task.dueDate && isToday(task.dueDate) && !task.completed).length
    const projectCounts = projects.reduce((acc, project) => {
      acc[project.id] = tasks.filter(task => task.projectId === project.id && !task.completed).length
      return acc
    }, {} as Record<string, number>)

    return { inboxCount, todayCount, projectCounts }
  }, [tasks, projects])

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      addProject(newProjectName, newProjectColor)
      setNewProjectName('')
      setNewProjectColor(projectColors[0].value)
      setIsDialogOpen(false)
    }
  }

  const handleEditProject = () => {
    if (editingProject && editingProject.name.trim()) {
      editProject(editingProject.id, { name: editingProject.name, color: editingProject.color })
      setEditingProject(null)
    }
  }

  return (
    <div className="w-64 border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Button variant="ghost" size="icon" className="mr-2">
          <span className="h-6 w-6 rounded-full bg-red-500" />
        </Button>
        <span className="font-semibold">Rafael</span>
        <div className="ml-auto" />
      </div>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="space-y-4 p-4">
          <div className="space-y-1">
            <Button
              asChild
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2",
                pathname === "/search" && "bg-accent"
              )}
            >
              <Link href="/search">
                <Search className="h-4 w-4" />
                Buscar
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2",
                pathname === "/inbox" && "bg-accent"
              )}
            >
              <Link href="/inbox">
                <Home className="h-4 w-4" />
                Entrada
                <span className="ml-auto text-muted-foreground">{counts.inboxCount}</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2",
                pathname === "/" && "bg-accent"
              )}
            >
              <Link href="/">
                <Calendar className="h-4 w-4" />
                Hoje
                <span className="ml-auto text-muted-foreground">{counts.todayCount}</span>
              </Link>
            </Button>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between py-2">
              <h2 className="text-sm font-semibold">Meus projetos</h2>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <FolderPlus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar novo projeto</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Input
                      placeholder="Nome do projeto"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                    />
                    <RadioGroup
                      value={newProjectColor}
                      onValueChange={setNewProjectColor}
                      className="grid grid-cols-4 gap-2"
                    >
                      {projectColors.map((color) => (
                        <div key={color.value}>
                          <RadioGroupItem
                            value={color.value}
                            id={color.value}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={color.value}
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <span className={`h-6 w-6 rounded-full bg-${color.value}-500`} />
                            <span className="mt-2">{color.name}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    <Button onClick={handleAddProject}>Adicionar</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            {projects.map((project) => (
              <div key={project.id} className="flex items-center">
                <Button
                  asChild
                  variant="ghost"
                  className={cn(
                    "flex-1 justify-start gap-2",
                    pathname === `/project/${project.id}` && "bg-accent"
                  )}
                >
                  <Link href={`/project/${project.id}`}>
                    <span className={`h-2 w-2 rounded-full bg-${project.color}-500`} />
                    {project.name}
                    <span className="ml-auto text-muted-foreground">
                      {counts.projectCounts[project.id] || 0}
                    </span>
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingProject(project)}>Editar</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => deleteProject(project.id)}>Excluir</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
      {editingProject && (
        <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar projeto</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Nome do projeto"
                value={editingProject.name}
                onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
              />
              <RadioGroup
                value={editingProject.color}
                onValueChange={(color) => setEditingProject({ ...editingProject, color })}
                className="grid grid-cols-4 gap-2"
              >
                {projectColors.map((color) => (
                  <div key={color.value}>
                    <RadioGroupItem
                      value={color.value}
                      id={`edit-${color.value}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`edit-${color.value}`}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span className={`h-6 w-6 rounded-full bg-${color.value}-500`} />
                      <span className="mt-2">{color.name}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <Button onClick={handleEditProject}>Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

