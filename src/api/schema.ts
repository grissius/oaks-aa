export const typeDefs = `#graphql
  type Task {
    id: ID
    completed: Boolean
    displayName: String
  }

  type Phase {
    id: ID
    completed: Boolean
    displayName: String
    tasks(limit: Int): [Task]
  }

  type Progress {
    id: ID
    displayName: String
    phases: [Phase]
  }

  type Query {
    progress(id: ID): Progress
    # TODO: standalone tasks connection/pagination to support unlimited lists
  }

  type CheckResponse {
    # TODO: status + message
    success: Boolean
  }
  
  type Mutation {
    check(id: ID): CheckResponse
    uncheck(id: ID): CheckResponse
  }
`
