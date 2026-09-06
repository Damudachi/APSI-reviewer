import { describe, it, expect, beforeEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { newDb } from 'pg-mem'
import { createSchema, insertSighting, getSighting } from './sightings.js'

// The tests run against an in-memory Postgres (pg-mem), so no real database is
// needed. `db.adapters.createPg()` gives a drop-in node-postgres client, exactly
// the API a real `pg` Pool exposes.
let client
beforeEach(async () => {
  const db = newDb()
  const { Pool } = db.adapters.createPg()
  client = new Pool()
  await createSchema(client)
})

describe('createSchema(client)', () => {
  it('creates a usable sightings table', async () => {
    const res = await client.query('SELECT * FROM sightings')
    expect(res.rows).toEqual([])
  })
})

describe('insertSighting(client, sighting)', () => {
  it('inserts a row and returns it with a generated id', async () => {
    const row = await insertSighting(client, { place: 'Old gym', description: 'footsteps', spookiness: 5 })
    expect(row.id).toBeTruthy()
    expect(row.place).toBe('Old gym')
    expect(row.spookiness).toBe(5)
  })

  it('actually persists the row in the table', async () => {
    await insertSighting(client, { place: 'Chapel', description: null, spookiness: 3 })
    const res = await client.query('SELECT * FROM sightings')
    expect(res.rows.length).toBe(1)
    expect(res.rows[0].place).toBe('Chapel')
  })
})

describe('getSighting(client, id)', () => {
  it('returns the matching row', async () => {
    const created = await insertSighting(client, { place: 'Rooftop', description: null, spookiness: 2 })
    const found = await getSighting(client, created.id)
    expect(found.place).toBe('Rooftop')
  })

  it('returns null when no row matches', async () => {
    const found = await getSighting(client, 9999)
    expect(found).toBeNull()
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
