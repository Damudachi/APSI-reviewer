import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import request from 'supertest'
import { createApp } from './app.js'

const app = createApp()

describe('GET /health', () => {
  it('returns 200 and { status: "ok" }', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok' })
  })

  it('runs the custom middleware (sets the X-Api header)', async () => {
    const res = await request(app).get('/health')
    expect(res.headers['x-api']).toBe('haunted-sightings')
  })
})

describe('GET /sightings', () => {
  it('returns 200 and a non-empty array of sightings', async () => {
    const res = await request(app).get('/sightings')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThan(0)
  })

  it('each sighting has a place and a spookiness', async () => {
    const res = await request(app).get('/sightings')
    const first = res.body[0]
    expect(typeof first.place).toBe('string')
    expect(typeof first.spookiness).toBe('number')
  })
})

describe('unknown routes', () => {
  it('returns 404 with an error message', async () => {
    const res = await request(app).get('/does-not-exist')
    expect(res.status).toBe(404)
    expect(res.body.error).toBeTruthy()
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
