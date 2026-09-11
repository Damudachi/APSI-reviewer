// Prints your current answers for all 12 exam questions. Run with `npm run exam`.
import { app } from './app.js'
const server = app.listen(0)
const base = `http://localhost:${server.address().port}`
const get = async (p) => { const r = await fetch(base + p); return { status: r.status, body: await r.json().catch(() => null) } }

const stats = (await get('/api/stats')).body || {}
const historyDept = (await get('/api/enrollments/search?dept=' + encodeURIComponent('History'))).body
const one = await get('/api/enrollments/42')
const badGet = await get('/api/enrollments/999999')

let postInvalidStatus, postValidStatus, patchStatus, patchBody, deleteStatus

try {
  const rInvalid = await fetch(base + '/api/enrollments', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ grade_score: 95 }) // missing student_name and course_id
  })
  postInvalidStatus = rInvalid.status
} catch { postInvalidStatus = '(error)' }

try {
  const rValid = await fetch(base + '/api/enrollments', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ course_id: 1, student_name: 'Test Student', grade_score: 90, enrolled_date: '2026-01-01', is_honors: true })
  })
  postValidStatus = rValid.status
} catch { postValidStatus = '(error)' }

try {
  const rPatch = await fetch(base + '/api/enrollments/1/grade', {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ grade_score: 99 })
  })
  patchStatus = rPatch.status
  patchBody = await rPatch.json().catch(() => null)
} catch { patchStatus = '(error)' }

try {
  const rDelete = await fetch(base + '/api/enrollments/999999', { method: 'DELETE' })
  deleteStatus = rDelete.status
} catch { deleteStatus = '(error)' }

const line = (n, label, val) => console.log(`Q${n}`.padEnd(4) + label.padEnd(34) + ': ' + val)
line(1, 'Total enrollments', stats.total)
line(2, 'Average grade', stats.avgGrade)
line(3, 'Ungraded count (= NULL bug)', stats.ungraded)
line(4, 'Top instructor', stats.topInstructor)
line(5, 'History department count', Array.isArray(historyDept) ? historyDept.length : '(filter not fixed yet)')
line(6, 'Student column BEFORE fixing', 'read this off the ORIGINAL buggy dashboard')
line(7, 'Enrollment 42 student_name', one.status === 200 ? one.body.student_name : '(look-up route missing)')
line(8, 'Enrollment 42 grade_score', one.status === 200 ? one.body.grade_score : '(look-up route missing)')
line(9, 'POST invalid body -> status', postInvalidStatus)
line(10, 'POST valid body -> status', postValidStatus)
line(11, 'PATCH grade -> updated grade', patchStatus === 200 ? patchBody?.grade_score : `status: ${patchStatus}`)
line(12, 'DELETE unknown id -> status', deleteStatus)

server.close()
