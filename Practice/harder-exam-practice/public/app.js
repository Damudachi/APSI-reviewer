// public/app.js - the dashboard. It fetches the API and fills the page.
// There is ONE bug in here (see the table). Everything else is correct.
async function json(url) { const r = await fetch(url); return { status: r.status, body: await r.json().catch(() => null) } }

async function loadStats() {
  const { body } = await json('/api/stats')
  document.getElementById('total').textContent = body.total
  document.getElementById('topGenre').textContent = body.topGenre
  document.getElementById('longPlays').textContent = body.longPlays
  document.getElementById('topArtist').textContent = body.topArtist
}

async function loadTable() {
  const { body } = await json('/api/plays')
  const tbody = document.getElementById('rows')
  tbody.innerHTML = ''
  for (const s of body.slice(0, 25)) {
    const tr = document.createElement('tr')
    // BUG E: one of these reads a field that does not exist on the row, so that
    //        column shows "undefined". Fix the field name to duration_secs.
    tr.innerHTML = `<td>${s.id}</td><td>${s.listener}</td><td>${s.duration}</td><td>${s.artist_id}</td><td>${(s.played_at || '').slice(0, 10)}</td>`
    tbody.appendChild(tr)
  }
}

document.getElementById('filterBtn').onclick = async () => {
  const genre = document.getElementById('genreInput').value
  const { body } = await json('/api/plays/search?genre=' + encodeURIComponent(genre))
  document.getElementById('filterResult').textContent = Array.isArray(body) ? `${body.length} plays` : 'error'
}

document.getElementById('lookupBtn').onclick = async () => {
  const id = document.getElementById('idInput').value
  const { status, body } = await json('/api/plays/' + encodeURIComponent(id))
  const el = document.getElementById('lookupResult')
  if (status === 404) el.textContent = 'No play with that id.'
  else if (body && body.listener) el.textContent = `Play ${body.id}: ${body.listener}, ${body.duration_secs} secs`
  else el.textContent = 'The look-up route is not working yet.'
}

loadStats(); loadTable()
