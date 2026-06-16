import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

function getFilePath(filename: string) {
  return path.join(DATA_DIR, filename)
}

export function readData<T>(filename: string): T[] {
  ensureDataDir()
  const filePath = getFilePath(filename)
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]), 'utf-8')
    return []
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(raw) as T[]
  } catch {
    return []
  }
}

export function writeData<T>(filename: string, data: T[]): void {
  ensureDataDir()
  const filePath = getFilePath(filename)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

export function appendData<T extends object>(filename: string, newEntry: T): T & { id: string; createdAt: string } {
  const existing = readData<T & { id: string; createdAt: string }>(filename)
  const entry = {
    ...newEntry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    status: 'baru' // default status for all leads
  }
  existing.push(entry)
  writeData(filename, existing)
  return entry
}

export function updateStatus(filename: string, id: string, status: string): boolean {
  const existing = readData<{ id: string; status: string } & Record<string, unknown>>(filename)
  const idx = existing.findIndex((item) => item.id === id)
  if (idx === -1) return false
  existing[idx].status = status
  existing[idx].updatedAt = new Date().toISOString()
  writeData(filename, existing)
  return true
}
