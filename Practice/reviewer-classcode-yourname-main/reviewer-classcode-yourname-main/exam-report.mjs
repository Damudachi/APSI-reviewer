// Prints your current answers for the 10 reviewer questions. Run locally with
// `npm run exam`, or read it from the GitHub Actions run summary after you push.
import { app } from './app.js'
const server = app.listen(0)
const base = `http://localhost:${server.address().port}`
const get = async (p) => { const r = await fetch(base + p); return { status: r.status, body: await r.json().catch(() => null) } }
const stats = (await get('/api/stats')).body || {}
const mystery = (await get('/api/loans/search?genre=' + encodeURIComponent('mystery'))).body
const one = await get('/api/loans/42')
const bad = await get('/api/loans/999999')
let postStatus
try {
  const r = await fetch(base + '/api/loans', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ book_id: 1, member: 'demo', days_out: 1, borrowed_at: '2026-01-01' }) })
  postStatus = r.status
} catch { postStatus = '(app not running)' }
const line = (n, label, val) => console.log(`Q${n}`.padEnd(4) + label.padEnd(30) + ': ' + val)
line(1, 'Total loans', stats.total)
line(2, 'Most borrowed genre', stats.topGenre)
line(3, 'Long loans (> 14 days)', stats.longLoans)
line(4, 'Busiest author', stats.topAuthor)
line(5, 'mystery genre count', Array.isArray(mystery) ? mystery.length : '(filter not fixed yet)')
line(6, 'Days-out column BEFORE fixing', 'read this off the ORIGINAL buggy dashboard')
line(7, 'Loan 42 member', one.status === 200 ? one.body.member : '(look-up route not added yet)')
line(8, 'Loan 42 days_out', one.status === 200 ? one.body.days_out : '(look-up route not added yet)')
line(9, 'GET unknown id -> status', bad.status)
line(10, 'POST -> status', postStatus)
server.close()
