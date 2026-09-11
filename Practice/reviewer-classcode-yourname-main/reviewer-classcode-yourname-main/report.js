// report.js - prints the dashboard values as text, in case you would rather
// read them in the terminal than in the browser. Run with `npm run report`.
import { app } from './app.js'
const server = app.listen(0)
const base = `http://localhost:${server.address().port}`
const get = async p => { const r = await fetch(base + p); return { status: r.status, body: await r.json().catch(() => null) } }

const stats = (await get('/api/stats')).body
console.log('Total loans        :', stats.total)
console.log('Most borrowed genre:', stats.topGenre)
console.log('Long loans (>14)   :', stats.longLoans)
console.log('Busiest author     :', stats.topAuthor)
const m = (await get('/api/loans/search?genre=' + encodeURIComponent('mystery'))).body
console.log('mystery loan count :', Array.isArray(m) ? m.length : '(filter broken)')
const one = await get('/api/loans/42')
console.log('loan 42            :', one.status === 200 ? `${one.body.member}, ${one.body.days_out} days out` : '(look-up route missing)')
server.close()
