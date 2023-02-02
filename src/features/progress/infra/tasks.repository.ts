import { randomUUID } from 'crypto'
import { Progress, Phase, Task } from '../domain/task.entity'
import {
  GetTasksResponse,
  TasksRepository,
} from '../domain/tasks.repository.port'

export class TasksInMemoryRepository implements TasksRepository {
  private progresses: Progress[] = []
  private phases: Phase[] = []
  private tasks: Task[] = []
  constructor() {}

  async getProgress(progressId: string): Promise<Progress> {
    const existing = this.progresses.find(p => p.id === progressId)
    if (existing) return existing

    const { phases, progress, tasks } =
      TasksInMemoryRepository.demoProgress(progressId)
    this.progresses.push(progress)
    this.tasks.push(...tasks)
    this.phases.push(...phases)
    return progress
  }
  async getPhases(progressId: string): Promise<Phase[]> {
    return Promise.all(
      this.phases
        .filter(p => p.progressId === progressId)
        .sort((a, b) => a.orderKey - b.orderKey)
        .map(async p => ({
          ...p,
          completed: (await this.getTasks(p.id, this.tasks.length)).tasks.every(
            t => t.completed
          ),
        }))
    )
  }

  async getTasks(
    phaseId: Phase['id'],
    limit = 10,
    nextPageCursor?: string
  ): Promise<GetTasksResponse> {
    const orderUnique = (t: Task) => `${t.orderKey}:${t.id}`
    // TODO: Get last task order-key, order by
    this.tasks.sort((a, b) => orderUnique(a).localeCompare(orderUnique(b)))
    const tasks = this.tasks
      .filter(t => t.phaseId === phaseId)
      .filter(
        t => !nextPageCursor || orderUnique(t).localeCompare(nextPageCursor) > 0
      )
      .slice(0, limit)
    return {
      tasks,
      nextPageToken: (t => (t ? orderUnique(t) : t))(tasks.at(-1)),
    }
  }

  async getTask(taskId: Task['id']): Promise<Task | null> {
    return this.tasks.find(t => t.id === taskId) ?? null
  }

  async getPhase(phaseId: Phase['id']): Promise<Phase | null> {
    return this.phases.find(p => p.id === phaseId) ?? null
  }

  async changeTaskStatus(id: string, completed: boolean): Promise<void> {
    const task = this.tasks.find(t => t.id === id)
    if (task) {
      task.completed = completed
    }
  }

  static demoProgress(progressId: string) {
    const progress: Progress = {
      displayName: 'My startup progress',
      id: progressId,
    }
    const phases = ['Foundation', 'Discovery', 'Delivery'].map(
      (displayName, i): Phase => ({
        displayName,
        id: randomUUID(),
        completed: false,
        progressId: progress.id,
        orderKey: i,
      })
    )
    const [foundation, discovery, delivery] = phases
    const tasks = [
      { name: 'Set up virtual office', phaseId: foundation.id },
      { name: 'Set mission & vision', phaseId: foundation.id },
      { name: 'Select business name', phaseId: foundation.id },
      { name: 'Buy domains', phaseId: foundation.id },

      { name: 'Create roadmap', phaseId: discovery.id },
      { name: 'Competitor analyses', phaseId: discovery.id },

      { name: 'Release marketing website', phaseId: delivery.id },
      { name: 'Release MVP', phaseId: delivery.id },
    ].map(
      (t, i): Task => ({
        completed: false,
        displayName: t.name,
        id: randomUUID(),
        phaseId: t.phaseId,
        orderKey: i,
      })
    )
    return { progress, phases, tasks }
  }
}
