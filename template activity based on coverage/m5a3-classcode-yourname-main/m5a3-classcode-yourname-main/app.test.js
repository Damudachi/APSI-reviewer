import { describe, it, expect, beforeEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import request from 'supertest'
import { newDb } from 'pg-mem'
import { createApp } from './app.js'
import { createSchema, create } from './sightingsRepo.js'

// Wire the app to a fresh in-memory Postgres, seeded with one sighting.
let app
let seededId
beforeEach(async () => {
  const db = newDb()
  const { Pool } = db.adapters.createPg()
  const pool = new Pool()
  await createSchema(pool)
  const seed = await create(pool, { place: 'Library 3rd floor', description: 'cold spot', spookiness: 4 })
  seededId = seed.id
  app = createApp(pool)
})

describe('GET /health', () => {
  it('returns 200 and { status: "ok" }', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok' })
  })
})

describe('GET /sightings', () => {
  it('returns 200 and the rows from the database', async () => {
    const res = await request(app).get('/sightings')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBe(1)
  })
})

describe('GET /sightings/:id', () => {
  it('returns 200 and the matching row', async () => {
    const res = await request(app).get(`/sightings/${seededId}`)
    expect(res.status).toBe(200)
    expect(res.body.place).toBe('Library 3rd floor')
  })

  it('returns 404 for an id that does not exist', async () => {
    const res = await request(app).get('/sightings/9999')
    expect(res.status).toBe(404)
    expect(res.body.error).toBeTruthy()
  })
})

describe('POST /sightings', () => {
  it('creates a row and returns 201, persisting it', async () => {
    const res = await request(app)
      .post('/sightings')
      .send({ place: 'Chapel', description: 'organ played itself', spookiness: 3 })
    expect(res.status).toBe(201)
    expect(res.body.id).toBeTruthy()
    expect(res.body.place).toBe('Chapel')

    const list = await request(app).get('/sightings')
    expect(list.body.length).toBe(2)
  })

  it('rejects an invalid body with 400', async () => {
    const noPlace = await request(app).post('/sightings').send({ spookiness: 3 })
    expect(noPlace.status).toBe(400)
    const badLevel = await request(app).post('/sightings').send({ place: 'Gym', spookiness: 9 })
    expect(badLevel.status).toBe(400)
  })
})

describe('PATCH /sightings/:id', () => {
  it('updates and returns 200 with the updated row', async () => {
    const res = await request(app).patch(`/sightings/${seededId}`).send({ spookiness: 1 })
    expect(res.status).toBe(200)
    expect(res.body.spookiness).toBe(1)
  })

  it('returns 404 when the id does not exist', async () => {
    const res = await request(app).patch('/sightings/9999').send({ spookiness: 1 })
    expect(res.status).toBe(404)
  })
})

describe('DELETE /sightings/:id', () => {
  it('deletes and returns 204', async () => {
    const res = await request(app).delete(`/sightings/${seededId}`)
    expect(res.status).toBe(204)
    const after = await request(app).get(`/sightings/${seededId}`)
    expect(after.status).toBe(404)
  })

  it('returns 404 when the id does not exist', async () => {
    const res = await request(app).delete('/sightings/9999')
    expect(res.status).toBe(404)
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
