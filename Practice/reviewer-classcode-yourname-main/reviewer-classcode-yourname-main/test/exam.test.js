// Non-scoring self-check. This is the REVIEWER, so it only tells you whether
// each bug and TODO is fixed. It computes the correct answer from the data
// itself and compares it to your app, so no answers are written here.
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fs from 'node:fs'
import { app } from '../app.js'
import { pool } from '../db.js'

let server, base
beforeAll(() => { server = app.listen(0); base = `http://localhost:${server.address().port}` })
afterAll(() => server && server.close())
const get = async (p) => { const r = await fetch(base + p); return { status: r.status, body: await r.json().catch(() => null) } }

describe('Module 5 - the stats queries', () => {
  it('BUG A: "most borrowed genre" is the MOST frequent genre', async () => {
    const expected = (await pool.query(
      'SELECT b.genre FROM loans l JOIN books b ON l.book_id = b.id GROUP BY b.genre ORDER BY COUNT(*) DESC, b.genre LIMIT 1'
    )).rows[0].genre
    expect((await get('/api/stats')).body.topGenre).toBe(expected)
  })
  it('BUG B: "long loans" counts loans out MORE THAN 14 days', async () => {
    const expected = (await pool.query('SELECT COUNT(*)::int AS c FROM loans WHERE days_out > 14')).rows[0].c
    expect((await get('/api/stats')).body.longLoans).toBe(expected)
  })
  it('BUG C: "busiest author" groups by author, not title', async () => {
    const expected = (await pool.query(
      'SELECT b.author FROM loans l JOIN books b ON l.book_id = b.id GROUP BY b.author ORDER BY COUNT(*) DESC, b.author LIMIT 1'
    )).rows[0].author
    expect((await get('/api/stats')).body.topAuthor).toBe(expected)
  })
})

describe('Module 4 - the routes', () => {
  it('BUG D: the genre filter returns only loans in the requested genre', async () => {
    const { body } = await get('/api/loans/search?genre=' + encodeURIComponent('mystery'))
    const expected = (await pool.query(
      "SELECT COUNT(*)::int AS c FROM loans l JOIN books b ON l.book_id = b.id WHERE b.genre = 'mystery'"
    )).rows[0].c
    expect(Array.isArray(body)).toBe(true)
    expect(body.length).toBe(expected)
    expect(body.length).toBeGreaterThan(0)
  })
  it('TODO 1: GET /api/loans/:id returns the matching row', async () => {
    const { status, body } = await get('/api/loans/42')
    expect(status).toBe(200)
    expect(body.id).toBe(42)
  })
  it('TODO 1: an unknown id returns 404', async () => {
    expect((await get('/api/loans/999999')).status).toBe(404)
  })
  it('TODO 2: POST /api/loans creates a row and returns 201', async () => {
    const r = await fetch(base + '/api/loans', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ book_id: 1, member: 'selftest', days_out: 3, borrowed_at: '2026-01-01' }),
    })
    const body = await r.json().catch(() => null)
    expect(r.status).toBe(201)
    expect(body && body.member).toBe('selftest')
    expect(body && body.id).toBeGreaterThan(0)
  })
})

describe('The dashboard', () => {
  it('BUG E: the table reads days_out, not a field that does not exist', () => {
    const src = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8')
    expect(src).not.toMatch(/\.daysout\b/)
    expect(src).toMatch(/\.days_out\b/)
  })
})
