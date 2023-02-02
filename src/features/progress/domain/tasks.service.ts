import { Phase, Progress, Task } from './task.entity'
import { TasksRepository } from './tasks.repository.port'

enum PhaseStatus {
  /** Completed phase, all tasks are done */
  COMPLETED = 'COMPLETED',
  /** Open/Active phase, tasks can be completed, all preceding phases are COMPLETED */
  OPEN = 'OPEN',
  /** Blocked phase, preceding phases must be COMPLETE first */
  BLOCKED = 'BLOCKED',
}

// TODO: Define return types
export class TasksService {
  constructor(private readonly tasksRepo: TasksRepository) {}

  public async check(taskId: string) {
    const task = await this.tasksRepo.getTask(taskId)
    // TODO: Refactor spaghetti early exits (e.g. FP pipeline / task.progressId)
    if (!task) {
      return { success: false } // TODO: Reason or return empty Task as NOT_FOUND
    }
    const tasksPhase = await this.tasksRepo.getPhase(task.phaseId)
    if (!tasksPhase) {
      return { success: false } // TODO: Reason or return empty Task as NOT_FOUND
    }
    const phaseIsOpen =
      (await this.getPhases(tasksPhase.progressId)).find(
        p => p.id === tasksPhase.id
      )?.status === PhaseStatus.OPEN
    if (!phaseIsOpen) {
      return { success: false } // TODO: Reason blocked
    }
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
    return (await this.tasksRepo.getPhases(progressId)).map(
      (phase, i, phases) => {
        const prevDone = phases[i - 1]?.completed ?? true
        return {
          ...phase,
          status: phase.completed
            ? PhaseStatus.COMPLETED
            : prevDone
            ? PhaseStatus.OPEN
            : PhaseStatus.BLOCKED,
        }
      }
    )
  }

  public async getTasks(
    phaseId: Phase['id'],
    limit?: number,
    nextPageCursor?: string
  ) {
    return (await this.tasksRepo.getTasks(phaseId, limit, nextPageCursor)).tasks
  }
}
