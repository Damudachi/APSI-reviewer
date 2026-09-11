// app.js - Music Stream Plays API. Practice Exam for Midterm.
//
// This app MOSTLY works. It serves a dashboard at http://localhost:3000 that
// reads from the API below. But there are BUGS to fix and two TODOs to finish.
// Start it with `npm start`, open the dashboard, and make every panel show correct numbers.
// `npm run report` or `npm run exam` prints the values.

import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { pool } from './db.js'

export const app = express()
app.use(express.json())

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public')
app.use(express.static(publicDir))

// GET /api/plays - every play. (Worked example - do not change.)
app.get('/api/plays', async (req, res) => {
  const result = await pool.query('SELECT * FROM plays ORDER BY id')
  res.json(result.rows)
})

// GET /api/stats - dashboard panel numbers.
// Fix the three SQL queries below that have bugs.
app.get('/api/stats', async (req, res) => {
  const total = (await pool.query('SELECT COUNT(*)::int AS c FROM plays')).rows[0].c

  // BUG A: "most played genre" is coming out as the LEAST played genre because of sorting direction.
  const topGenre = (await pool.query(
    'SELECT a.genre, COUNT(*)::int AS c FROM plays p JOIN artists a ON p.artist_id = a.id GROUP BY a.genre ORDER BY c DESC'
  )).rows[0].genre

  // BUG B: "long plays" should be plays with duration MORE THAN 180 seconds (> 180),
  //        but it is using the wrong operator (< 180).
  const longPlays = (await pool.query(
    'SELECT COUNT(*)::int AS c FROM plays WHERE duration_secs > 180'
  )).rows[0].c

  // BUG C: "busiest artist" should group by artist NAME (a.name), but it selects/groups by genre instead.
  //        Fix the query so it selects a.name AS artist_name and groups by a.name ORDER BY c DESC.
  const topArtist = (await pool.query(
    'SELECT a.name AS artist_name, COUNT(*)::int AS c FROM plays p JOIN artists a ON p.artist_id = a.id GROUP BY a.name ORDER BY c DESC'
  )).rows[0].artist_name

  res.json({ total, topGenre, longPlays, topArtist })
})

// GET /api/plays/search?genre=... - plays of artists in one genre.
// BUG D: it reads the wrong query-string field (req.query.genre_type instead of req.query.genre),
//        so the filter never matches.
app.get('/api/plays/search', async (req, res) => {
  const wanted = req.query.genre// dashboard sends ?genre=...
  const result = await pool.query(
    'SELECT p.* FROM plays p JOIN artists a ON p.artist_id = a.id WHERE a.genre = $1 ORDER BY p.id',
    [wanted]
  )
  res.json(result.rows)
})

// TODO 1: Add route GET /api/plays/:id to look up a single play by id.
//         Return the matching row, or status 404 with { error: 'Play not found' } if no play exists.
app.get(`/api/plays/:id`, async (req, res) => {
  const result = await pool.query('SELECT * FROM plays WHERE id = $1', [req.params.id])
  if (result.rows.length === 0) return res.status(404).json({ error: `Play not found` })
  res.json(result.rows[0])

})

// TODO 2: Add route POST /api/plays to insert a new play from req.body (artist_id, listener, duration_secs, played_at).
//         Return the created row with RETURNING * and status code 201.
app.post('/api/plays', async (req, res) => {
  const insert = await pool.query('INSERT INTO plays (artist_id, listener, duration_secs, played_at) VALUES ($1, $2, $3, $4) RETURNING * ', [req.body.artist_id, req.body.listener, req.body.duration_secs, req.body.played_at])
  res.status(201).json(insert.rows[0])
})

if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(3000, () => console.log('Music Plays API running on http://localhost:3000'))
}
