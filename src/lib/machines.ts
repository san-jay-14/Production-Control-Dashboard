import { machines } from './mock-data'
import type { Machine } from './types'

const byId = new Map(machines.map((machine) => [machine.id, machine]))

export function machineById(machineId: string): Machine | undefined {
  return byId.get(machineId)
}

export function machineName(machineId: string): string {
  return byId.get(machineId)?.name ?? 'Unassigned'
}
