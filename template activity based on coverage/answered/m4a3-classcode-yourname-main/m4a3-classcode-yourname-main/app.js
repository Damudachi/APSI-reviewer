// Module 4 - Activity 3 - A RESTful API (in-memory)

import express from 'express'

export function createApp() {
  const app = express()
  app.use(express.json())

  // In-memory store, fresh for each createApp(). `nextId` hands out new ids.
  const sightings = [
    { id: 1, place: 'Library 3rd floor', description: 'cold spot near the stacks', spookiness: 4, reportedAt: '2026-07-01T20:00:00Z' },
    { id: 2, place: 'Old gym', description: 'footsteps, nobody there', spookiness: 5, reportedAt: '2026-07-03T22:15:00Z' },
  ]
  let nextId = 3

  function validNew(body) {
    return (
      typeof body?.place === 'string' &&
      body.place.trim() !== '' &&
      Number.isInteger(body?.spookiness) &&
      body.spookiness >= 1 &&
      body.spookiness <= 5
    )
  }

  // TODO: GET /sightings -> 200 with the whole array.
  app.get('/sightings', (req, res) => {
    res.status(200).json(sightings)
  })

  // TODO: GET /sightings/:id -> 200 with the matching sighting, or 404 if none matches.
  app.get('/sightings/:id', (req, res) => {
    const id = Number(req.params.id)
    const sighting = sightings.find(s => s.id === id)
    if (!sighting) {
      return res.status(404).json({ error: 'Sighting not found' })
    }
    res.status(200).json(sighting)
  })

  // TODO: POST /sightings -> validate req.body. If invalid, 400 with { error }.
  app.post('/sightings', (req, res) => {
    if (!validNew(req.body)) {
      return res.status(400).json({ error: 'Invalid sighting body' })
    }
    const newSighting = {
      id: nextId++,
      place: req.body.place,
      description: req.body.description ?? null,
      spookiness: req.body.spookiness,
      reportedAt: new Date().toISOString()
    }
    sightings.push(newSighting)
    res.status(201).json(newSighting)
  })

  // TODO: PATCH /sightings/:id -> if no match, 404. Otherwise update and respond 200.
  app.patch('/sightings/:id', (req, res) => {
    const id = Number(req.params.id)
    const sighting = sightings.find(s => s.id === id)
    if (!sighting) {
      return res.status(404).json({ error: 'Sighting not found' })
    }
    Object.assign(sighting, req.body)
    res.status(200).json(sighting)
  })

  // TODO: DELETE /sightings/:id -> if no match, 404. Otherwise remove and respond 204.
  app.delete('/sightings/:id', (req, res) => {
    const id = Number(req.params.id)
    const index = sightings.findIndex(s => s.id === id)
    if (index === -1) {
      return res.status(404).json({ error: 'Sighting not found' })
    }
    sightings.splice(index, 1)
    res.status(204).end()
  })

  // 404 fallback for anything unmatched.
  app.use((req, res) => res.status(404).json({ error: 'Not found' }))

  return app
}
