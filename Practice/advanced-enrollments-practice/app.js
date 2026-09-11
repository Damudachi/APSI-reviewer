// app.js - Course Enrollments & Grades API. Advanced Midterm Practice Exam.
//
// This app MOSTLY works. It serves a dashboard at http://localhost:3000 that
// reads from the API below. There are 4 NEW BUGS to fix and 4 TODOs to finish!
// Start it with `npm start`, open the dashboard, and run `npm run exam` to check your score.

import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { pool } from './db.js'

export const app = express()
app.use(express.json())

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public')
app.use(express.static(publicDir))

// GET /api/enrollments - all enrollments. (Worked example - do not change.)
app.get('/api/enrollments', async (req, res) => {
  const result = await pool.query('SELECT * FROM enrollments ORDER BY id')
  res.json(result.rows)
})

// GET /api/stats - dashboard panel numbers.
// Fix the three SQL queries below that have NEW types of bugs.
app.get('/api/stats', async (req, res) => {
  const total = (await pool.query('SELECT COUNT(*)::int AS c FROM enrollments')).rows[0].c

  // BUG A: "Average Grade" panel is showing the total sum of all grades instead of the average.
  const avgGrade = (await pool.query(
    'SELECT SUM(grade_score)::int AS a FROM enrollments WHERE grade_score IS NOT NULL'
  )).rows[0].a

  // BUG B: "Ungraded count" panel shows 0, but there are students with missing/NULL grades.
  const ungraded = (await pool.query(
    'SELECT COUNT(*)::int AS c FROM enrollments WHERE grade_score IS NULL'
  )).rows[0].c

  // BUG C: "Top Instructor" should group by instructor, but an instructor with multiple courses is counted separately for each course.
  const topInstructor = (await pool.query(
    'SELECT c.instructor, COUNT(*)::int AS c FROM enrollments e JOIN courses c ON e.course_id = c.id GROUP BY c.instructor ORDER BY c DESC'
  )).rows[0].instructor

  res.json({ total, avgGrade, ungraded, topInstructor })
})

// GET /api/enrollments/search?dept=... - enrollments in one department.
// BUG D: it reads the wrong request property, so the department filter never matches.
app.get('/api/enrollments/search', async (req, res) => {
  const wanted = req.query.dept // dashboard sends query string ?dept=...
  const result = await pool.query(
    'SELECT e.* FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE c.department = $1 ORDER BY e.id',
    [wanted]
  )
  res.json(result.rows)
})

// TODO 1: Add GET /api/enrollments/:id route to look up a single enrollment by id.
//         Return the matching row, or status 404 with { error: 'Enrollment not found' } if no enrollment exists.

app.get(`/api/enrollments/:id`, async (req, res) => {
  const find = await pool.query(`SELECT * FROM enrollments WHERE id = $1`, [req.params.id])
  if (find.rows.length === 0) return res.status(404).json({ error: `Not found` })
  res.status(200).json(find.rows[0])
})
// TODO 2: Add POST /api/enrollments route to insert a new enrollment from req.body (course_id, student_name, grade_score, enrolled_date, is_honors).
//         Validation: If student_name or course_id is missing, respond with status 400 and { error: 'Missing required fields' }.
//         Otherwise insert row and respond with status 201.
app.post(`/api/enrollments`, async (req, res) => {
  if (!(req.body.student_name.trim() === '' || req.body.course_id.trim() === '')) return res.status(400).json({ error: 'Missing required fields' })
  const insert = await pool.query(`INSERT INTO enrollments (course_id, student_name, grade_score, enrolled_date, is_honors) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [req.body.course_id, req.body.student_name, req.body.grade_score, req.body.enrolled_date, req.body.is_honors])
  res.status(201).json(insert.rows[0])
})

// TODO 3: Add PATCH /api/enrollments/:id/grade route to update grade_score for an enrollment by id.
//         Read grade_score from req.body. Update the record and return the updated row, or 404 if not found.

app.patch(`/api/enrollments/:id/grade`, async (req, res) => {
  const update = await pool.query(`UPDATE enrollments SET grade_score = $1 WHERE id = $2 RETURNING *`, [req.body.grade_score, req.params.id])
  if (update.rows.length === 0) return res.status(404).json({ error: `Not found` })
  res.status(200).json(update.rows[0])
})


// TODO 4: Add DELETE /api/enrollments/:id route to delete an enrollment by id.
//         If found, delete the record and respond with status 200 and { message: 'Enrollment deleted', deleted: <row> }.
//         If not found, respond with status 404 and { error: 'Enrollment not found' }.
app.delete(`/api/enrollments/:id`, async (req, res) => {
  const deletedId = await pool.query(`DELETE FROM enrollments WHERE id = $1 RETURNING *`, [req.params.id])
  if (deletedId.rows.length === 0) return res.status(404).json({ error: `Enrollment not found` })
  res.status(200).json({ message: 'Enrollment deleted', deleted: deletedId.rows[0] })
})

if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(3000, () => console.log('Course Enrollments API running on http://localhost:3000'))
}
