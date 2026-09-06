// Module 4 - Activity 3 - A RESTful API (in-memory)
//
// Turn the server into a full CRUD REST API for sightings. The data lives in a
// plain array for now, so it resets whenever the server restarts - that is on
// purpose. Module 5 moves this exact API onto a real PostgreSQL database.
//
// Build all five routes inside createApp() and RETURN the app. Read
// backend-theory/05 (RESTful design patterns) carefully - it defines which verb,
// which URL, and which status code each operation uses.

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

  // Helper you may use: is this a valid new sighting body?
  // (place must be a non-empty string; spookiness must be an integer 1..5)

  // TODO: GET /sightings -> 200 with the whole array.
  app.get('/sightings', (req, res) => {
    res.status(200).json(sightings)})
  // TODO: GET /sightings/:id -> 200 with the matching sighting, or 404 with
  // { error: ... } if none matches. Remember req.params.id is a STRING.
  app.get('/sightings/:id', (req, res) => {
    const targetId = Number(req.params.id)
    const sighting = sightings.find((sight) => sight.id === targetId)
    if (sighting) {
      res.status(200).json(sighting)
    } else {
      res.status(404).json({ error: 'Sighting not found' })
    }
  })
  // TODO: POST /sightings -> validate req.body. If invalid, 400 with { error }.
  // If valid, create a new sighting { id: nextId++, place, description,
  // spookiness, reportedAt: new Date().toISOString() }, add it to the array, and
  // respond 201 with the created object.
  app.post('/sightings', (req, res) => {
      const { place, description, spookiness } = req.body
      if (!place || typeof place !== 'string' || typeof spookiness !== 'number' || spookiness < 1 || spookiness > 5) {
      return res.status(400).json({ error: 'Invalid data. Place must be a string and spookiness must be an integer 1-5.' })
    }
    const newSighting = {
      id: nextId++,
      place: place,
      description: description,
      spookiness: spookiness,
      reportedAt: new Date().toISOString()
    }

    sightings.push(newSighting)
    res.status(201).json(newSighting)
  })
  // TODO: PATCH /sightings/:id -> if no match, 404. Otherwise update the given
  // fields on the found sighting and respond 200 with the updated object.
 app.patch('/sightings/:id', (req, res) => {
    const targetId = Number(req.params.id)
    const sighting = sightings.find((sight) => sight.id === targetId)

    if (!sighting){
      return res.status(404).json({ error: 'Sighting not found' })
    }
    if (req.body.place) {
      sighting.place = req.body.place
    }
    if (req.body.description) {
      sighting.description = req.body.description
    }
    if (req.body.spookiness) {
      sighting.spookiness = req.body.spookiness
    }

    res.status(200).json(sighting)
 }
)
  // TODO: DELETE /sightings/:id -> if no match, 404. Otherwise remove it and
  // respond 204 with no body (res.status(204).end()).
  app.delete('/sightings/:id', (req, res) => {
    const targetId = Number(req.params.id)
    const index = sightings.findIndex((sight) => sight.id === targetId)

    if (index === -1){
      return res.status(404).json({ error: 'Sighting not found' })
    }
    sightings.splice(index, 1)
    res.status(204).end()
  })
  // 404 fallback for anything unmatched.
  app.use((req, res) => res.status(404).json({ error: 'Not found' }))

  return app
}
