// Prints your current answers for the 10 exam questions. Run locally with `npm run exam`.
import { app } from './app.js'
const server = app.listen(0)
const base = `http://localhost:${server.address().port}`
const get = async (p) => { const r = await fetch(base + p); return { status: r.status, body: await r.json().catch(() => null) } }
const stats = (await get('/api/stats')).body || {}
const rock = (await get('/api/plays/search?genre=' + encodeURIComponent('rock'))).body
const one = await get('/api/plays/42')
const bad = await get('/api/plays/999999')
let postStatus
try {
  const r = await fetch(base + '/api/plays', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ artist_id: 1, listener: 'demo', duration_secs: 180, played_at: '2026-01-01' }) })
  postStatus = r.status
} catch { postStatus = '(app not running)' }

const line = (n, label, val) => console.log(`Q${n}`.padEnd(4) + label.padEnd(32) + ': ' + val)
line(1, 'Total plays', stats.total)
line(2, 'Most played genre', stats.topGenre)
line(3, 'Long plays (> 180 secs)', stats.longPlays)
line(4, 'Busiest artist', stats.topArtist)
line(5, 'rock genre count', Array.isArray(rock) ? rock.length : '(filter not fixed yet)')
line(6, 'Duration column BEFORE fixing', 'read this off the ORIGINAL buggy dashboard')
line(7, 'Play 42 listener', one.status === 200 ? one.body.listener : '(look-up route not added yet)')
line(8, 'Play 42 duration_secs', one.status === 200 ? one.body.duration_secs : '(look-up route not added yet)')
line(9, 'GET unknown id -> status', bad.status)
line(10, 'POST -> status', postStatus)
server.close()
