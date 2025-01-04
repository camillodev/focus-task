'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTaskStore } from '@/lib/store'
import { Bell, Focus, Play, SkipForward, Square, X } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import { Task } from '@/lib/store'

interface FocusModeProps {
  tasks: Task[]
}

export function FocusMode({ tasks }: FocusModeProps) {
  const { toast } = useToast()
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const focusState = useTaskStore((state) => state.focusState)
  const focusSettings = useTaskStore((state) => state.focusSettings)
  const setFocusSettings = useTaskStore((state) => state.setFocusSettings)
  const startFocusMode = useTaskStore((state) => state.startFocusMode)
  const stopFocusMode = useTaskStore((state) => state.stopFocusMode)
  const skipTask = useTaskStore((state) => state.skipTask)
  const completeCurrentTask = useTaskStore((state) => state.completeCurrentTask)
  const currentTask = tasks.find(t => t.id === focusState.currentTaskId) || tasks[0]

  const totalTime = focusState.isBreak
    ? (focusState.currentSession % focusSettings.sessionsUntilLongBreak === 0
      ? focusSettings.longBreakDuration
      : focusSettings.breakDuration)
    : focusSettings.workDuration

  useEffect(() => {
    if (!focusState.isActive && currentTask) {
      startFocusMode(currentTask.id)
    }
  }, [focusState.isActive, currentTask, startFocusMode])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false)
      if (focusState.isBreak) {
        toast({
          title: "Break finished!",
          description: "Time to get back to work.",
        })
        startFocusMode(focusState.currentTaskId!)
        setTimeLeft(focusSettings.workDuration * 60)
      } else {
        toast({
          title: "Time for a break!",
          description: focusState.currentSession % focusSettings.sessionsUntilLongBreak === 0
            ? "You've earned a long break."
            : "Take a short break.",
        })
        useTaskStore.getState().startBreak()
        setTimeLeft(
          (focusState.currentSession % focusSettings.sessionsUntilLongBreak === 0
            ? focusSettings.longBreakDuration
            : focusSettings.breakDuration) * 60
        )
      }
    }

    return () => clearInterval(interval)
  }, [isRunning, timeLeft, focusState, focusSettings, toast, startFocusMode])

  useEffect(() => {
    if (focusState.isActive && !isRunning) {
      setTimeLeft(totalTime * 60)
    }
  }, [focusState.isActive, totalTime, isRunning])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = ((totalTime * 60 - timeLeft) / (totalTime * 60)) * 100

  if (!currentTask) {
    return null
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Focus className="h-5 w-5" />
            {focusState.isBreak ? 'Break Time' : 'Focus Time'}
          </span>
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Bell className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Focus Settings</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="workDuration">Work Duration (minutes)</Label>
                  <Input
                    id="workDuration"
                    type="number"
                    value={focusSettings.workDuration}
                    onChange={(e) => setFocusSettings({ workDuration: Number(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="breakDuration">Break Duration (minutes)</Label>
                  <Input
                    id="breakDuration"
                    type="number"
                    value={focusSettings.breakDuration}
                    onChange={(e) => setFocusSettings({ breakDuration: Number(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="longBreakDuration">Long Break Duration (minutes)</Label>
                  <Input
                    id="longBreakDuration"
                    type="number"
                    value={focusSettings.longBreakDuration}
                    onChange={(e) => setFocusSettings({ longBreakDuration: Number(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sessionsUntilLongBreak">Sessions Until Long Break</Label>
                  <Input
                    id="sessionsUntilLongBreak"
                    type="number"
                    value={focusSettings.sessionsUntilLongBreak}
                    onChange={(e) => setFocusSettings({ sessionsUntilLongBreak: Number(e.target.value) })}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!focusState.isBreak && (
          <p className="text-lg font-medium text-center">
            {currentTask.title}
          </p>
        )}
        <div className="text-center text-5xl font-bold tabular-nums">
          {formatTime(timeLeft)}
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-center text-sm text-muted-foreground">
          Session {focusState.currentSession} of {focusSettings.sessionsUntilLongBreak}
        </p>
      </CardContent>
      <CardFooter className="justify-between space-x-2">
        <Button
          className={cn(
            "flex-1 bg-primary text-primary-foreground hover:bg-primary/90",
            focusState.isBreak && "bg-green-500 hover:bg-green-600"
          )}
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? <Square className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        {!focusState.isBreak && (
          <>
            <Button
              variant="outline"
              onClick={() => {
                skipTask()
                setTimeLeft(focusSettings.workDuration * 60)
              }}
            >
              <SkipForward className="h-4 w-4 mr-2" />
              Skip
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                completeCurrentTask()
                setTimeLeft(focusSettings.workDuration * 60)
              }}
            >
              Done
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}

