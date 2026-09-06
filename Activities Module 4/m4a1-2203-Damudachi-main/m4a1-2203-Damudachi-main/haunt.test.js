import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { slugify, spookinessLabel, isRecent, validateSighting } from './haunt.js'

describe('slugify(place)', () => {
  it('lowercases and turns spaces into hyphens', () => {
    expect(slugify('Old Gym')).toBe('old-gym')
  })

  it('strips punctuation and trims the ends', () => {
    expect(slugify('  Library, 3rd Floor! ')).toBe('library-3rd-floor')
  })

  it('collapses repeated separators into one hyphen', () => {
    expect(slugify('Room   101 -- B')).toBe('room-101-b')
  })
})

describe('spookinessLabel(level)', () => {
  it('maps levels 1 through 5 to their labels', () => {
    expect(spookinessLabel(1)).toBe('Barely a chill')
    expect(spookinessLabel(2)).toBe('Goosebumps')
    expect(spookinessLabel(3)).toBe('Spooky')
    expect(spookinessLabel(4)).toBe('Terrifying')
    expect(spookinessLabel(5)).toBe('Run!')
  })

  it('returns "Unknown" for levels outside 1 through 5', () => {
    expect(spookinessLabel(0)).toBe('Unknown')
    expect(spookinessLabel(6)).toBe('Unknown')
  })
})

describe('isRecent(reportedAt, now)', () => {
  const now = new Date('2026-07-20T00:00:00Z').getTime()

  it('is true when the sighting is within the last 7 days', () => {
    expect(isRecent('2026-07-15T00:00:00Z', now)).toBe(true)
  })

  it('is false when the sighting is older than 7 days', () => {
    expect(isRecent('2026-07-01T00:00:00Z', now)).toBe(false)
  })
})

describe('validateSighting(sighting)', () => {
  it('accepts a well-formed sighting with no errors', () => {
    const result = validateSighting({ place: 'Old Gym', description: 'footsteps', spookiness: 4 })
    expect(result.valid).toBe(true)
    expect(result.errors).toEqual([])
  })

  it('rejects a missing or empty place', () => {
    const result = validateSighting({ place: '', spookiness: 4 })
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  it('rejects a spookiness outside 1 through 5', () => {
    expect(validateSighting({ place: 'Gym', spookiness: 9 }).valid).toBe(false)
    expect(validateSighting({ place: 'Gym', spookiness: 0 }).valid).toBe(false)
  })
})

describe('Student info (student.json)', () => {
  const path = fileURLToPath(new URL('./student.json', import.meta.url))
  const info = JSON.parse(readFileSync(path, 'utf8'))

  for (const field of ['classCode', 'fullName', 'studentNumber', 'studentEmail', 'personalEmail', 'githubAccount']) {
    it(`${field} is filled in`, () => {
      expect(info[field], `Set ${field} in student.json`).toBeTruthy()
    })
  }
})
