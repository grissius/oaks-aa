import { Task } from '../domain/task.entity'
import { TasksInMemoryRepository } from './tasks.repository'

describe(TasksInMemoryRepository, () => {
  test('Pagination works', async () => {
    const repo = new TasksInMemoryRepository()
    const progressId = '1'
    await repo.getProgress(progressId)
    const [phaseA] = await repo.getPhases(progressId)
    const allTasks = await repo.getTasks(phaseA.id, 1000)

    const paginate = async (lastId?: string): Promise<Task[]> => {
      const page = await repo.getTasks(phaseA.id, 1, lastId)
      return page.length === 0
        ? []
        : page.concat(...(await paginate(page.at(-1)?.id)))
    }
    const compoundTasks = await paginate()
    expect(allTasks.length).toBeGreaterThan(0) // Else test not valid
    expect(allTasks).toEqual(compoundTasks)
  })
})
