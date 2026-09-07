// Module 4 - Activity 2 - Your first Express server

import express from 'express'

// A small seed list so GET /sightings has something to return.
const seed = [
  { id: 1, place: 'Library 3rd floor', description: 'cold spot near the stacks', spookiness: 4, reportedAt: '2026-07-01T20:00:00Z' },
  { id: 2, place: 'Old gym', description: 'footsteps, nobody there', spookiness: 5, reportedAt: '2026-07-03T22:15:00Z' },
]

export function createApp() {
  const app = express()

  // TODO: add the express.json() middleware
  app.use(express.json())

  // TODO: add a custom middleware (req, res, next)
  app.use((req, res, next) => {
    res.setHeader('X-Api', 'haunted-sightings')
    console.log(`${req.method} ${req.path}`)
    next()
  })

  // TODO: GET /health -> respond 200 with JSON { status: 'ok' }
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' })
  })

  // TODO: GET /sightings -> respond 200 with the `seed` array as JSON
  app.get('/sightings', (req, res) => {
    res.status(200).json(seed)
  })

  // TODO: after all routes, add a catch-all middleware that responds 404
  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' })
  })

  return app
}
