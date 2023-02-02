export interface Task {
  id: string
  displayName: string
  completed: boolean
  phaseId: Phase['id']
  orderKey: number
}

export interface Phase {
  id: string
  displayName: string
  completed: boolean
  progressId: string
  orderKey: number
}

export interface Progress {
  id: string
  displayName: string
}
