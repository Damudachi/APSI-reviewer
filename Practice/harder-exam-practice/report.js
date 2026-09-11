// report.js - prints the dashboard values as text. Run with `npm run report`.
import { app } from './app.js'
const server = app.listen(0)
const base = `http://localhost:${server.address().port}`
const get = async p => { const r = await fetch(base + p); return { status: r.status, body: await r.json().catch(() => null) } }

const stats = (await get('/api/stats')).body || {}
console.log('Total plays        :', stats.total)
console.log('Most played genre  :', stats.topGenre)
console.log('Long plays (>180s) :', stats.longPlays)
console.log('Busiest artist     :', stats.topArtist)
const r = (await get('/api/plays/search?genre=' + encodeURIComponent('rock'))).body
console.log('rock play count    :', Array.isArray(r) ? r.length : '(filter broken)')
const one = await get('/api/plays/42')
console.log('play 42            :', one.status === 200 ? `${one.body.listener}, ${one.body.duration_secs} secs` : '(look-up route missing)')
server.close()
