// Module 5 - Activity 3 - REST API backed by PostgreSQL (the capstone)
//
// This is where the whole midterm comes together. You have a REST API (Module 4)
// and a Postgres data layer (m5a2). Now you WIRE them: build the Express routes so
// that each one calls the matching data-access function. The routes handle HTTP
// (status codes, req/res); the data layer (sightingsRepo.js, provided) handles
// SQL. Keep that separation clean - it is the point of this activity.
//
// Build createApp(pool) and RETURN the app. Every route is async and awaits the
// repo. Read db-theory/04 for the route -> data-access mapping.

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

  // TODO: GET /health -> 200 with { status: 'ok' }.

  // TODO: GET /sightings -> 200 with await getAll(pool).

  // TODO: GET /sightings/:id -> await getById(pool, req.params.id). If null, 404
  // with { error: ... }; otherwise 200 with the row.

  // TODO: POST /sightings -> if !validNew(req.body), 400 with { error }. Otherwise
  // await create(pool, req.body) and respond 201 with the created row.

  // TODO: PATCH /sightings/:id -> load the existing row (getById). If null, 404.
  // Otherwise merge req.body over it and await update(pool, id, merged), then 200
  // with the updated row.

  // TODO: DELETE /sightings/:id -> await remove(pool, req.params.id). Respond 204
  // if it returned true, else 404.

  // 404 fallback for anything unmatched.
  app.use((req, res) => res.status(404).json({ error: 'Not found' }))

  return app
}
