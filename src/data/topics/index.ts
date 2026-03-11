// src/data/topics/index.ts
// Single source of truth for all presentation stops.
// Import this array wherever stop data is needed — never import individual stop files directly.
import type { Stop } from '@/types/presentation'
import { stopTheCase } from './stop-01-the-case'
import { stopVision } from './stop-02-vision'
import { stopHowWeWork } from './stop-03-how-we-work'
import { stopMigration } from './stop-04-migration'
import { stopSummary } from './stop-05-summary'

export const stops: Stop[] = [
  stopTheCase,
  stopVision,
  stopHowWeWork,
  stopMigration,
  stopSummary,
]
