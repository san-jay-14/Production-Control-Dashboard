import { machines } from './mock-data'

const byId = new Map(machines.map((machine) => [machine.id, machine]))

export function machineName(machineId: string): string {
  return byId.get(machineId)?.name ?? 'Unassigned'
}
