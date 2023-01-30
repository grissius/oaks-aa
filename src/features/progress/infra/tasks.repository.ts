import { randomUUID } from 'crypto'
import { Progress, Phase, Task } from '../domain/task.entity'
import { TasksRepository } from '../domain/tasks.repository.port'

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
        .map(async p => ({
          ...p,
          completed: (await this.getTasks(p.id, this.tasks.length)).every(
            t => t.completed
          ),
        }))
    )
  }

  async getTasks(
    phaseId: Phase['id'],
    limit = 10,
    lastTaskId?: Task['id']
  ): Promise<Task[]> {
    // TODO: Get last task order-key, order by
    this.tasks.sort((a, b) => a.id.localeCompare(b.id))
    return this.tasks
      .filter(t => t.phaseId === phaseId)
      .filter(t => !lastTaskId || t.id.localeCompare(lastTaskId) > 0)
      .slice(0, limit)
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
      (displayName): Phase => ({
        displayName,
        id: randomUUID(),
        completed: false,
        progressId: progress.id,
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
      (t): Task => ({
        completed: false,
        displayName: t.name,
        id: randomUUID(),
        phaseId: t.phaseId,
      })
    )
    return { progress, phases, tasks }
  }
}
