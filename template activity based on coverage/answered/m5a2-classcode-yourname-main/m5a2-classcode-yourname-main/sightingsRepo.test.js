import { describe, it, expect, beforeEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { newDb } from 'pg-mem'
import { createSchema, create, getAll, getById, update, remove } from './sightingsRepo.js'

// A fresh in-memory Postgres per test, with the schema already created.
let pool
beforeEach(async () => {
  const db = newDb()
  const { Pool } = db.adapters.createPg()
  pool = new Pool()
  await createSchema(pool)
})

describe('create', () => {
  it('inserts a row and returns it with a generated id', async () => {
    const row = await create(pool, { place: 'Old gym', description: 'footsteps', spookiness: 5 })
    expect(row.id).toBeTruthy()
    expect(row.place).toBe('Old gym')
    expect(row.spookiness).toBe(5)
  })
})

describe('getAll', () => {
  it('returns an empty array when there are no rows', async () => {
    expect(await getAll(pool)).toEqual([])
  })

  it('returns every row', async () => {
    await create(pool, { place: 'A', description: null, spookiness: 1 })
    await create(pool, { place: 'B', description: null, spookiness: 2 })
    const all = await getAll(pool)
    expect(all.length).toBe(2)
    expect(all.map((r) => r.place).sort()).toEqual(['A', 'B'])
  })
})

describe('getById', () => {
  it('returns the matching row', async () => {
    const created = await create(pool, { place: 'Chapel', description: null, spookiness: 3 })
    const found = await getById(pool, created.id)
    expect(found.place).toBe('Chapel')
  })

  it('returns null when nothing matches', async () => {
    expect(await getById(pool, 9999)).toBeNull()
  })
})

describe('update', () => {
  it('updates fields and returns the updated row', async () => {
    const created = await create(pool, { place: 'Rooftop', description: 'wind', spookiness: 2 })
    const updated = await update(pool, created.id, { place: 'Rooftop', description: 'wind', spookiness: 4 })
    expect(updated.spookiness).toBe(4)
    expect(updated.id).toBe(created.id)
  })

  it('returns null when the id does not exist', async () => {
    const updated = await update(pool, 9999, { place: 'X', description: null, spookiness: 1 })
    expect(updated).toBeNull()
  })
})

describe('remove', () => {
  it('deletes the row and returns true', async () => {
    const created = await create(pool, { place: 'Basement', description: null, spookiness: 5 })
    expect(await remove(pool, created.id)).toBe(true)
    expect(await getById(pool, created.id)).toBeNull()
  })

  it('returns false when the id does not exist', async () => {
    expect(await remove(pool, 9999)).toBe(false)
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
