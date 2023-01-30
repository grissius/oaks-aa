import { Phase, Progress, Task } from './task.entity'

export interface TasksRepository {
  getProgress: (progressId: Progress['id']) => Promise<Progress>
  getPhases: (progressId: Progress['id']) => Promise<Phase[]>
  getTasks: (
    phaseId: Phase['id'],
    limit?: number,
    lastTaskId?: Task['id']
  ) => Promise<Task[]>
  changeTaskStatus: (id: Task['id'], completed: boolean) => Promise<void>
}
