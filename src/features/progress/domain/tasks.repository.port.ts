import { Phase, Progress, Task } from './task.entity'

export interface TasksRepository {
  // TODO: Return T | null on details
  // TODO: Consider separating into 3 interfaces (ISP)
  getProgress: (progressId: Progress['id']) => Promise<Progress>
  getPhases: (progressId: Progress['id']) => Promise<Phase[]>
  getTasks: (
    phaseId: Phase['id'],
    limit?: number,
    lastTaskId?: Task['id']
  ) => Promise<Task[]>
  getTask: (taskId: Task['id']) => Promise<Task | null>
  getPhase: (phaseId: Phase['id']) => Promise<Phase | null>
  changeTaskStatus: (id: Task['id'], completed: boolean) => Promise<void>
}
