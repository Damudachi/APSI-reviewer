import { describe, it, expect, beforeEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import request from 'supertest'
import { newDb } from 'pg-mem'
import { createApp } from './app.js'
import { createSchema } from './schema.js'
import * as investigatorsRepo from './investigatorsRepo.js'
import * as sightingsRepo from './sightingsRepo.js'

// A fresh in-memory Postgres per test, seeded with two investigators and three
// sightings, so every test starts from the same known world.
let pool
let app
let ada
let boris

beforeEach(async () => {
  const db = newDb()
  const { Pool } = db.adapters.createPg()
  pool = new Pool()
  await createSchema(pool)

  ada = await investigatorsRepo.create(pool, { name: 'Ada Reyes', email: 'ada@hau.edu' })
  boris = await investigatorsRepo.create(pool, { name: 'Boris Cruz', email: 'boris@hau.edu' })

  await sightingsRepo.create(pool, {
    investigator_id: ada.id, place: 'Library 3rd floor', description: 'cold spot', spookiness: 2,
  })
  await sightingsRepo.create(pool, {
    investigator_id: ada.id, place: 'Old gym', description: 'footsteps', spookiness: 5,
  })
  await sightingsRepo.create(pool, {
    investigator_id: boris.id, place: 'Chapel', description: 'organ at 3am', spookiness: 4,
  })

  app = createApp(pool)
})

describe('The schema (two related tables)', () => {
  it('creates both tables, and a sighting belongs to an investigator', async () => {
    const result = await pool.query(
      'SELECT investigator_id FROM sightings WHERE place = $1',
      ['Chapel']
    )
    expect(result.rows[0].investigator_id).toBe(boris.id)
  })

  it('the foreign key rejects a sighting whose investigator does not exist', async () => {
    await expect(
      pool.query(
        `INSERT INTO sightings (investigator_id, place, description, spookiness)
         VALUES ($1, $2, $3, $4)`,
        [9999, 'Nowhere', 'nothing', 1]
      )
    ).rejects.toThrow()
  })

  it('an investigator email is unique', async () => {
    await expect(
      pool.query('INSERT INTO investigators (name, email) VALUES ($1, $2)', ['Copycat', 'ada@hau.edu'])
    ).rejects.toThrow()
  })
})

describe('The data layer', () => {
  it('investigatorsRepo.create returns the row with a generated id', async () => {
    const row = await investigatorsRepo.create(pool, { name: 'Cara Lim', email: 'cara@hau.edu' })
    expect(row.id).toBeTruthy()
    expect(row.name).toBe('Cara Lim')
  })

  it('sightingsRepo.getById joins the investigator name onto the sighting', async () => {
    const all = await sightingsRepo.getAll(pool)
    const chapel = all.find(s => s.place === 'Chapel')
    const row = await sightingsRepo.getById(pool, chapel.id)
    expect(row.investigator_name).toBe('Boris Cruz')
  })

  it('sightingsRepo.getAll filters on minSpookiness', async () => {
    const spooky = await sightingsRepo.getAll(pool, { minSpookiness: 4 })
    expect(spooky.map(s => s.place).sort()).toEqual(['Chapel', 'Old gym'])
  })

  it('sightingsRepo.getByInvestigator returns only that investigator rows', async () => {
    const rows = await sightingsRepo.getByInvestigator(pool, ada.id)
    expect(rows).toHaveLength(2)
    expect(rows.every(r => r.investigator_id === ada.id)).toBe(true)
  })
})

describe('GET /health', () => {
  it('returns 200 and { status: "ok" }', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok' })
  })
})

describe('GET /investigators', () => {
  it('returns 200 and every investigator', async () => {
    const res = await request(app).get('/investigators')
    expect(res.status).toBe(200)
    expect(res.body.map(i => i.name)).toEqual(['Ada Reyes', 'Boris Cruz'])
  })
})

describe('POST /investigators', () => {
  it('creates an investigator and returns 201, persisting it', async () => {
    const res = await request(app)
      .post('/investigators')
      .send({ name: 'Cara Lim', email: 'cara@hau.edu' })
    expect(res.status).toBe(201)
    expect(res.body.id).toBeTruthy()

    const after = await request(app).get('/investigators')
    expect(after.body).toHaveLength(3)
  })

  it('rejects an invalid body with 400', async () => {
    const res = await request(app).post('/investigators').send({ name: '' })
    expect(res.status).toBe(400)
  })

  it('rejects an email that is already registered with 409', async () => {
    const res = await request(app)
      .post('/investigators')
      .send({ name: 'Copycat', email: 'ada@hau.edu' })
    expect(res.status).toBe(409)
  })
})

describe('GET /investigators/:id/sightings', () => {
  it('returns 200 and only that investigator sightings', async () => {
    const res = await request(app).get(`/investigators/${boris.id}/sightings`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].place).toBe('Chapel')
  })

  it('returns 404 when the investigator does not exist', async () => {
    const res = await request(app).get('/investigators/9999/sightings')
    expect(res.status).toBe(404)
  })
})

describe('GET /sightings', () => {
  it('returns 200 and every sighting with its investigator name', async () => {
    const res = await request(app).get('/sightings')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(3)
    const chapel = res.body.find(s => s.place === 'Chapel')
    expect(chapel.investigator_name).toBe('Boris Cruz')
  })

  it('filters on the minSpookiness query parameter', async () => {
    const res = await request(app).get('/sightings?minSpookiness=4')
    expect(res.status).toBe(200)
    expect(res.body.map(s => s.place).sort()).toEqual(['Chapel', 'Old gym'])
  })
})

describe('GET /sightings/:id', () => {
  it('returns 200 and the sighting with its investigator name', async () => {
    const all = await request(app).get('/sightings')
    const target = all.body.find(s => s.place === 'Old gym')

    const res = await request(app).get(`/sightings/${target.id}`)
    expect(res.status).toBe(200)
    expect(res.body.place).toBe('Old gym')
    expect(res.body.investigator_name).toBe('Ada Reyes')
  })

  it('returns 404 for an id that does not exist', async () => {
    const res = await request(app).get('/sightings/9999')
    expect(res.status).toBe(404)
  })
})

describe('POST /sightings', () => {
  it('creates a sighting and returns 201, persisting it', async () => {
    const res = await request(app)
      .post('/sightings')
      .send({ investigator_id: ada.id, place: 'Canteen', description: 'humming', spookiness: 3 })
    expect(res.status).toBe(201)
    expect(res.body.id).toBeTruthy()

    const after = await request(app).get('/sightings')
    expect(after.body).toHaveLength(4)
  })

  it('rejects an invalid body with 400', async () => {
    const res = await request(app).post('/sightings').send({ place: '', spookiness: 99 })
    expect(res.status).toBe(400)
  })

  it('rejects an investigator_id that does not exist with 400', async () => {
    const res = await request(app)
      .post('/sightings')
      .send({ investigator_id: 9999, place: 'Nowhere', description: 'nothing', spookiness: 2 })
    expect(res.status).toBe(400)
  })
})

describe('PATCH /sightings/:id', () => {
  it('updates and returns 200 with the updated sighting', async () => {
    const all = await request(app).get('/sightings')
    const target = all.body.find(s => s.place === 'Chapel')

    const res = await request(app).patch(`/sightings/${target.id}`).send({ spookiness: 1 })
    expect(res.status).toBe(200)
    expect(res.body.spookiness).toBe(1)
    expect(res.body.place).toBe('Chapel')
  })

  it('returns 404 when the id does not exist', async () => {
    const res = await request(app).patch('/sightings/9999').send({ spookiness: 1 })
    expect(res.status).toBe(404)
  })
})

describe('DELETE /sightings/:id', () => {
  it('deletes and returns 204', async () => {
    const all = await request(app).get('/sightings')
    const target = all.body.find(s => s.place === 'Chapel')

    const res = await request(app).delete(`/sightings/${target.id}`)
    expect(res.status).toBe(204)

    const after = await request(app).get('/sightings')
    expect(after.body).toHaveLength(2)
  })

  it('returns 404 when the id does not exist', async () => {
    const res = await request(app).delete('/sightings/9999')
    expect(res.status).toBe(404)
  })
})

describe('Middleware', () => {
  it('rejects an id that is not a number with 400', async () => {
    const res = await request(app).get('/sightings/abc')
    expect(res.status).toBe(400)
  })

  it('answers a malformed JSON body with 400 and a JSON error', async () => {
    const res = await request(app)
      .post('/sightings')
      .set('Content-Type', 'application/json')
      .send('{"place": ')
    expect(res.status).toBe(400)
    expect(typeof res.body.error).toBe('string')
  })

  it('answers an unknown route with 404', async () => {
    const res = await request(app).get('/ghosts')
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