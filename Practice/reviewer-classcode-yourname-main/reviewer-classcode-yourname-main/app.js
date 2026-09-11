// app.js - the Library Loans app (Module 4 + Module 5). This is the REVIEWER: a
// practice run for the midterm, same moves, different data.
//
// This app MOSTLY works. It serves a dashboard at http://localhost:3000 that
// reads from the API below. But there are a few BUGS to fix and two TODOs to
// finish. Start it with `npm start`, open the dashboard, and make every panel
// show correct numbers. `npm run report` prints the same values as text.
import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { pool } from './db.js'

export const app = express()
app.use(express.json())
// Serve the dashboard from this file's own folder, so it works no matter which
// directory you start the server from. (Infrastructure - not one of the bugs.)
const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public')
app.use(express.static(publicDir))

// GET /api/loans - every loan. (Worked example - do not change.)
app.get('/api/loans', async (req, res) => {
  const result = await pool.query('SELECT * FROM loans ORDER BY id')
  res.json(result.rows)
})

// GET /api/stats - the numbers the dashboard panels show.
// This route runs, but THREE of its queries are wrong. Fix them so each panel
// is correct.
app.get('/api/stats', async (req, res) => {
  const total = (await pool.query('SELECT COUNT(*)::int AS c FROM loans')).rows[0].c

  // BUG A: "most borrowed genre" is coming out as the LEAST borrowed one.
  const topGenre = (await pool.query(
    'SELECT b.genre, COUNT(*)::int AS c FROM loans l JOIN books b ON l.book_id = b.id GROUP BY b.genre ORDER BY c DESC'
  )).rows[0].genre

  // BUG B: "long loans" should be loans out for MORE THAN 14 days.
  const longLoans = (await pool.query(
    'SELECT COUNT(*)::int AS c FROM loans WHERE days_out > 14'
  )).rows[0].c

  // BUG C: "busiest author" should group by AUTHOR, but it groups by the book's
  //        title, so an author with two books is counted twice.
  const topAuthor = (await pool.query(
    'SELECT b.author AS author, COUNT(*)::int AS c FROM loans l JOIN books b ON l.book_id = b.id GROUP BY b.author ORDER BY c DESC'
  )).rows[0].author

  res.json({ total, topGenre, longLoans, topAuthor })
})

// GET /api/loans/search?genre=... - loans of books in one genre.
// BUG D: it reads the wrong query-string field, so the filter never matches.
app.get('/api/loans/search', async (req, res) => {
  const wanted = req.query.genre   // the dashboard sends ?genre=...
  const result = await pool.query(
    'SELECT l.* FROM loans l JOIN books b ON l.book_id = b.id WHERE b.genre = $1 ORDER BY l.id',
    [wanted]
  )
  res.json(result.rows)
})

// TODO 1: there is NO route to look up a single loan by id, so the dashboard's
//         "Look up a loan" box is broken. Add GET /api/loans/:id here. Return
//         the one matching row, or respond with the "not found" status code if
//         there is no such loan.
app.get('/api/loans/:id', async (req, res) => {
  const result = await pool.query('SELECT * FROM loans WHERE id = $1', [req.params.id])
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Loan not found' })
  }
  res.json(result.rows[0])
})

// POST /api/loans - add a new loan from the JSON body.
// TODO 2: insert a row from the body (book_id, member, days_out, borrowed_at)
//         and respond with the created row and the "created" status code.


app.post('/api/loans', async (req, res) => {
  const result = await pool.query(
    `INSERT INTO loans (book_id, member, days_out, borrowed_at)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [req.body.book_id, req.body.member, req.body.days_out, req.body.borrowed_at || new Date().toISOString()]
  )

  res.status(201).json(result.rows[0])
})

if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(3000, () => console.log('Library Loans on http://localhost:3000'))
}
