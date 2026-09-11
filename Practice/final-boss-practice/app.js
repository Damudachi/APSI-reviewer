// app.js - Final Boss Midterm Practice Reviewer
//
// Welcome to the Final Boss Practice! Fix the 4 BUGS and 3 TODOs in this file,
// plus BUG E in public/app.js.
// Then run `npm run report` to verify all 10 practice quiz answers!

import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { pool } from './db.js'
import * as repo from './sightingsRepo.js'

export const app = express()
app.use(express.json())

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public')
app.use(express.static(publicDir))

// GET /api/sightings - List all sightings (worked example)
app.get('/api/sightings', async (req, res) => {
  const result = await repo.getAll(pool)
  res.json(result)
})

// GET /api/stats - Dashboard analytics panels
app.get('/api/stats', async (req, res) => {
  const total = (await pool.query('SELECT COUNT(*)::int AS c FROM sightings')).rows[0].c

  // BUG A: "highest spookiness place" is showing the place with the LOWEST average spookiness.
  const topPlace = (await pool.query(
    'SELECT place, AVG(spookiness)::float AS avg_spook FROM sightings GROUP BY place ORDER BY avg_spook DESC'
  )).rows[0].place

  // BUG B: "busiest investigator" counts sightings but GROUPS by place instead of investigator name!
  const topInvestigator = (await pool.query(
    'SELECT i.name AS investigator_name, COUNT(*)::int AS c FROM sightings s JOIN investigators i ON s.investigator_id = i.id GROUP BY i.name ORDER BY c DESC'
  )).rows[0].investigator_name

  // BUG C: "high spookiness count" should count sightings with spookiness MORE THAN 4 (spookiness > 4).
  const highSpookiness = (await pool.query(
    'SELECT COUNT(*)::int AS c FROM sightings WHERE spookiness > 4'
  )).rows[0].c

  res.json({ total, topPlace, topInvestigator, highSpookiness })
})

// GET /api/sightings/search?place=... - Filter sightings by place
// BUG D: it reads the wrong query-string parameter (req.query.p instead of req.query.place).
app.get('/api/sightings/search', async (req, res) => {
  const wantedPlace = req.query.place // The frontend dashboard sends ?place=...
  const result = await pool.query(
    'SELECT s.*, i.name AS investigator_name FROM sightings s JOIN investigators i ON s.investigator_id = i.id WHERE s.place = $1 ORDER BY s.id',
    [wantedPlace]
  )
  res.json(result.rows)
})

// TODO 1: Add GET /api/sightings/:id
// Call repo.getById(pool, req.params.id). If null, return 404 with { error: 'Not found' }. Otherwise return 200 with the row.
app.get(`/api/sightings/:id`, async (req, res) => {
  const getId = await repo.getById(pool, req.params.id)
  if (!getId) return res.status(404).json({ error: `Not found` })
  return res.status(200).json(getId)
})

// TODO 2: Add POST /api/sightings
// Validate body: investigator_id (integer), place (non-empty string), spookiness (integer 1..5).
// If invalid, return 400 with { error: 'Invalid' }.
// Call repo.create(pool, req.body) and respond 201 with created row.
app.post(`/api/sightings`, async (req, res) => {
  if (!(Number.isInteger(req.body.investigator_id) && typeof req.body.place == `string` && req.body.place.trim() !== '' && Number.isInteger(req.body.spookiness) && req.body.spookiness >= 1 && req.body.spookiness <= 5))
    return res.status(400).json({ error: `Invalid` })
  const insertRow = await repo.create(pool, req.body)
  res.status(201).json(insertRow)
})

// TODO 3: Add PATCH /api/sightings/:id
// Load existing using repo.getById(pool, req.params.id). If null, return 404 with { error: 'Not found' }.
// Merge fields ({ ...existing, ...req.body }).
// Call repo.update(pool, req.params.id, merged) and respond 200 with updated row.
app.patch(`/api/sightings/:id`, async (req, res) => {
  const getId = await repo.getById(pool, req.params.id)
  if (!getId) return res.status(404).json({ error: `Not found` })
  const merged = { ...getId, ...req.body }
  const updated = await repo.update(pool, req.params.id, merged)
  res.status(200).json(updated)
})

if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(3000, () => console.log('Final Boss Practice running on http://localhost:3000'))
}
