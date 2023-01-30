export interface Task {
  id: string
  displayName: string
  completed: boolean
  phaseId: Phase['id']
}

export interface Phase {
  id: string
  displayName: string
  completed: boolean
  progressId: string
}

export interface Progress {
  id: string
  displayName: string
}
