// Module 5 - Activity 3 - REST API backed by PostgreSQL (the capstone)

import express from 'express'
import { getAll, getById, create, update, remove } from './sightingsRepo.js'

function validNew(body) {
  return (
    typeof body?.place === 'string' &&
    body.place.trim() !== '' &&
    Number.isInteger(body?.spookiness) &&
    body.spookiness >= 1 &&
    body.spookiness <= 5
  )
}

export function createApp(pool) {
  const app = express()
  app.use(express.json())

  // TODO: GET /health -> 200 with { status: 'ok' }
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' })
  })

  // TODO: GET /sightings -> 200 with await getAll(pool)
  app.get('/sightings', async (req, res, next) => {
    try {
      const sightings = await getAll(pool)
      res.status(200).json(sightings)
    } catch (err) {
      next(err)
    }
  })

  // TODO: GET /sightings/:id -> await getById(pool, req.params.id)
  app.get('/sightings/:id', async (req, res, next) => {
    try {
      const sighting = await getById(pool, req.params.id)
      if (!sighting) {
        return res.status(404).json({ error: 'Sighting not found' })
      }
      res.status(200).json(sighting)
    } catch (err) {
      next(err)
    }
  })

  // TODO: POST /sightings -> if !validNew(req.body), 400. Otherwise await create(...) -> 201
  app.post('/sightings', async (req, res, next) => {
    try {
      if (!validNew(req.body)) {
        return res.status(400).json({ error: 'Invalid sighting body' })
      }
      const created = await create(pool, req.body)
      res.status(201).json(created)
    } catch (err) {
      next(err)
    }
  })

  // TODO: PATCH /sightings/:id -> load existing row. Merge req.body over it and await update(...) -> 200
  app.patch('/sightings/:id', async (req, res, next) => {
    try {
      const existing = await getById(pool, req.params.id)
      if (!existing) {
        return res.status(404).json({ error: 'Sighting not found' })
      }
      const merged = { ...existing, ...req.body }
      const updated = await update(pool, req.params.id, merged)
      res.status(200).json(updated)
    } catch (err) {
      next(err)
    }
  })

  // TODO: DELETE /sightings/:id -> await remove(pool, req.params.id). Respond 204 if true, else 404
  app.delete('/sightings/:id', async (req, res, next) => {
    try {
      const deleted = await remove(pool, req.params.id)
      if (!deleted) {
        return res.status(404).json({ error: 'Sighting not found' })
      }
      res.status(204).end()
    } catch (err) {
      next(err)
    }
  })

  // 404 fallback for anything unmatched
  app.use((req, res) => res.status(404).json({ error: 'Not found' }))

  return app
}
