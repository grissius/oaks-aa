import { Phase, Progress, Task } from './task.entity'
import { TasksRepository } from './tasks.repository.port'

export class TasksService {
  constructor(private readonly tasksRepo: TasksRepository) {}

  public async check(taskId: string) {
    // TODO: check previous phases
    await this.tasksRepo.changeTaskStatus(taskId, true)
    return { success: true }
  }
  public async uncheck(taskId: string) {
    await this.tasksRepo.changeTaskStatus(taskId, false)
    return { success: true }
  }

  public async getProgress(progressId: Progress['id']) {
    return this.tasksRepo.getProgress(progressId)
  }

  public async getPhases(progressId: Progress['id']) {
    return this.tasksRepo.getPhases(progressId)
  }

  public async getTasks(
    phaseId: Phase['id'],
    limit?: number,
    lastTaskId?: Task['id']
  ) {
    return this.tasksRepo.getTasks(phaseId, limit, lastTaskId)
  }
}
