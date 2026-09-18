export type JobStatus = 'Pending' | 'In Progress' | 'Delayed' | 'Completed'

export type MachineStatus = 'Idle' | 'Running' | 'Maintenance'

export interface Machine {
  id: string
  name: string
  type: string
  status: MachineStatus
}

export interface JobNote {
  id: string
  text: string
  createdAt: string
}

export interface Job {
  id: string
  productName: string
  customerName: string
  quantity: number
  dueDate: string
  status: JobStatus
  machineId: string
  notes: JobNote[]
  createdAt: string
  updatedAt: string
}
