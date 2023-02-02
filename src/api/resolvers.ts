import { TasksService } from '../features/progress/domain/tasks.service'
import { TasksInMemoryRepository } from '../features/progress/infra/tasks.repository'

// TODO: Move to individual features + compose
class TaskResolvers {
  constructor(private readonly tasksService: TasksService) {}

  getResolvers() {
    return {
      Query: {
        // TODO: Import generic types / codegen
        progress: (_: any, args: any) => this.tasksService.getProgress(args.id),
      },
      Mutation: {
        check: (_: any, args: any) => this.tasksService.check(args.id),
        uncheck: (_: any, args: any) => this.tasksService.uncheck(args.id),
      },
      Progress: {
        phases: (parent: any) => this.tasksService.getPhases(parent.id),
      },
      Phase: {
        tasks: (parent: any, args: any) =>
          this.tasksService.getTasks(parent.id, args.limit),
      },
    }
  }
}

// TODO: DI/container module
const service = new TasksService(new TasksInMemoryRepository())
export const resolvers = new TaskResolvers(service).getResolvers()
