import { describe, it, expect, beforeEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import request from 'supertest'
import { createApp } from './app.js'

// createApp() returns a fresh app with its own in-memory store, so each test
// starts clean.
let app
beforeEach(() => {
  app = createApp()
})

describe('GET /sightings', () => {
  it('returns 200 and an array', async () => {
    const res = await request(app).get('/sightings')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
  })
})

describe('GET /sightings/:id', () => {
  it('returns 200 and the matching sighting', async () => {
    const res = await request(app).get('/sightings/1')
    expect(res.status).toBe(200)
    expect(res.body.id).toBe(1)
    expect(typeof res.body.place).toBe('string')
  })

  it('returns 404 for an id that does not exist', async () => {
    const res = await request(app).get('/sightings/9999')
    expect(res.status).toBe(404)
    expect(res.body.error).toBeTruthy()
  })
})

describe('POST /sightings', () => {
  it('creates a sighting and returns 201 with the created object', async () => {
    const res = await request(app)
      .post('/sightings')
      .send({ place: 'Chapel', description: 'organ played itself', spookiness: 3 })
    expect(res.status).toBe(201)
    expect(res.body.id).toBeTruthy()
    expect(res.body.place).toBe('Chapel')
    expect(res.body.spookiness).toBe(3)
    expect(res.body.reportedAt).toBeTruthy()
  })

  it('persists the created sighting so it can be fetched back', async () => {
    const created = await request(app)
      .post('/sightings')
      .send({ place: 'Rooftop', spookiness: 2 })
    const res = await request(app).get(`/sightings/${created.body.id}`)
    expect(res.status).toBe(200)
    expect(res.body.place).toBe('Rooftop')
  })

  it('rejects an invalid body with 400', async () => {
    const noPlace = await request(app).post('/sightings').send({ spookiness: 3 })
    expect(noPlace.status).toBe(400)
    const badLevel = await request(app).post('/sightings').send({ place: 'Gym', spookiness: 9 })
    expect(badLevel.status).toBe(400)
  })
})

describe('PATCH /sightings/:id', () => {
  it('updates fields and returns 200 with the updated object', async () => {
    const res = await request(app).patch('/sightings/1').send({ spookiness: 2 })
    expect(res.status).toBe(200)
    expect(res.body.id).toBe(1)
    expect(res.body.spookiness).toBe(2)
  })

  it('returns 404 when the id does not exist', async () => {
    const res = await request(app).patch('/sightings/9999').send({ spookiness: 2 })
    expect(res.status).toBe(404)
  })
})

describe('DELETE /sightings/:id', () => {
  it('deletes and returns 204 with no body', async () => {
    const res = await request(app).delete('/sightings/1')
    expect(res.status).toBe(204)
    expect(res.body).toEqual({})
    const after = await request(app).get('/sightings/1')
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
