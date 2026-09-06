import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { newDb } from 'pg-mem'
import { createApp } from './app.js'
import { createSchema } from './schema.js'
import * as itemsRepo from './itemsRepo.js'
import * as borrowingsRepo from './borrowingsRepo.js'

let pool
let app
let laptop
let projector

beforeEach(async () => {
  const db = newDb()
  const { Pool } = db.adapters.createPg()
  pool = new Pool()
  await createSchema(pool)

  laptop = await itemsRepo.create(pool, { name: 'Dell XPS 15', category: 'Laptop' })
  projector = await itemsRepo.create(pool, { name: 'Epson Projector', category: 'AV Equipment' })

  await borrowingsRepo.create(pool, {
    item_id: laptop.id,
    student_name: 'Alex Tan',
    days: 5
  })
  await borrowingsRepo.create(pool, {
    item_id: laptop.id,
    student_name: 'Maria Santos',
    days: 2
  })
  await borrowingsRepo.create(pool, {
    item_id: projector.id,
    student_name: 'John Doe',
    days: 7
  })

  app = createApp(pool)
})

describe('Database Repositories', () => {
  it('borrowingsRepo.create inserts and returns row with generated id', async () => {
    const row = await borrowingsRepo.create(pool, {
      item_id: projector.id,
      student_name: 'Jane Smith',
      days: 3
    })
    expect(row.id).toBeTruthy()
    expect(row.student_name).toBe('Jane Smith')
  })

  it('borrowingsRepo.getById joins item_name onto the borrowing object', async () => {
    const all = await borrowingsRepo.getAll(pool)
    const first = all[0]
    const row = await borrowingsRepo.getById(pool, first.id)
    expect(row.item_name).toBe('Dell XPS 15')
  })

  it('borrowingsRepo.getAll filters by minDays', async () => {
    const rows = await borrowingsRepo.getAll(pool, { minDays: 5 })
    expect(rows).toHaveLength(2)
    expect(rows.map(r => r.student_name).sort()).toEqual(['Alex Tan', 'John Doe'])
  })

  it('borrowingsRepo.getByItem returns only borrowings for that item', async () => {
    const rows = await borrowingsRepo.getByItem(pool, laptop.id)
    expect(rows).toHaveLength(2)
  })

  it('borrowingsRepo.remove deletes a record and returns true', async () => {
    const all = await borrowingsRepo.getAll(pool)
    const target = all[0]
    const success = await borrowingsRepo.remove(pool, target.id)
    expect(success).toBe(true)

    const remaining = await borrowingsRepo.getAll(pool)
    expect(remaining).toHaveLength(2)
  })
})

describe('GET /health', () => {
  it('returns 200 and { status: "ok" }', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok' })
  })
})

describe('GET /items', () => {
  it('returns 200 and all items', async () => {
    const res = await request(app).get('/items')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(2)
  })
})

describe('POST /items', () => {
  it('creates an item and returns 201', async () => {
    const res = await request(app)
      .post('/items')
      .send({ name: 'Canon DSLR', category: 'Camera' })
    expect(res.status).toBe(201)
    expect(res.body.id).toBeTruthy()
  })

  it('rejects invalid body with 400', async () => {
    const res = await request(app).post('/items').send({ name: '' })
    expect(res.status).toBe(400)
  })
})

describe('GET /items/:id/borrowings', () => {
  it('returns 200 and borrowings for that item', async () => {
    const res = await request(app).get(`/items/${laptop.id}/borrowings`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(2)
  })

  it('returns 404 if item does not exist', async () => {
    const res = await request(app).get('/items/9999/borrowings')
    expect(res.status).toBe(404)
  })
})

describe('GET /borrowings', () => {
  it('returns 200 and all borrowings with item_name', async () => {
    const res = await request(app).get('/borrowings')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(3)
    expect(res.body[0].item_name).toBeTruthy()
  })

  it('filters on minDays query parameter', async () => {
    const res = await request(app).get('/borrowings?minDays=5')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(2)
  })

  it('returns 400 for invalid minDays query string', async () => {
    const res = await request(app).get('/borrowings?minDays=abc')
    expect(res.status).toBe(400)
  })
})

describe('GET /borrowings/:id', () => {
  it('returns 200 and single borrowing', async () => {
    const all = await request(app).get('/borrowings')
    const target = all.body[0]
    const res = await request(app).get(`/borrowings/${target.id}`)
    expect(res.status).toBe(200)
    expect(res.body.student_name).toBe(target.student_name)
    expect(res.body.item_name).toBeTruthy()
  })

  it('returns 404 when id does not exist', async () => {
    const res = await request(app).get('/borrowings/9999')
    expect(res.status).toBe(404)
  })
})

describe('POST /borrowings', () => {
  it('creates borrowing and returns 201', async () => {
    const res = await request(app)
      .post('/borrowings')
      .send({ item_id: projector.id, student_name: 'Alice Cooper', days: 4 })
    expect(res.status).toBe(201)
    expect(res.body.id).toBeTruthy()
  })

  it('rejects invalid body with 400', async () => {
    const res = await request(app)
      .post('/borrowings')
      .send({ student_name: 'Invalid' })
    expect(res.status).toBe(400)
  })

  it('rejects non-existent item_id with 400', async () => {
    const res = await request(app)
      .post('/borrowings')
      .send({ item_id: 9999, student_name: 'Ghost User', days: 1 })
    expect(res.status).toBe(400)
  })
})

describe('DELETE /borrowings/:id', () => {
  it('deletes borrowing and returns 204', async () => {
    const all = await request(app).get('/borrowings')
    const target = all.body[0]
    const res = await request(app).delete(`/borrowings/${target.id}`)
    expect(res.status).toBe(204)
  })

  it('returns 404 if borrowing does not exist', async () => {
    const res = await request(app).delete('/borrowings/9999')
    expect(res.status).toBe(404)
  })
})

describe('Middleware & 404 Fallback', () => {
  it('rejects invalid non-numeric ID with 400', async () => {
    const res = await request(app).get('/borrowings/invalid-id')
    expect(res.status).toBe(400)
  })

  it('handles unknown routes with 404', async () => {
    const res = await request(app).get('/unknown-endpoint')
    expect(res.status).toBe(404)
  })
})
