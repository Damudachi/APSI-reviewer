// report.js - prints dashboard values as text. Run with `npm run report`.
import { app } from './app.js'
const server = app.listen(0)
const base = `http://localhost:${server.address().port}`
const get = async p => { const r = await fetch(base + p); return { status: r.status, body: await r.json().catch(() => null) } }

const stats = (await get('/api/stats')).body || {}
console.log('Total enrollments  :', stats.total)
console.log('Average grade      :', stats.avgGrade)
console.log('Ungraded count     :', stats.ungraded)
console.log('Top instructor     :', stats.topInstructor)
const r = (await get('/api/enrollments/search?dept=' + encodeURIComponent('History'))).body
console.log('History count      :', Array.isArray(r) ? r.length : '(filter broken)')
const one = await get('/api/enrollments/42')
console.log('Enrollment 42      :', one.status === 200 ? `${one.body.student_name}, grade: ${one.body.grade_score}` : '(look-up route missing)')
server.close()
