// public/app.js - Dashboard Frontend logic
async function json(url) { const r = await fetch(url); return { status: r.status, body: await r.json().catch(() => null) } }

async function loadStats() {
  const { body } = await json('/api/stats')
  if (!body) return
  document.getElementById('total').textContent = body.total
  document.getElementById('topPlace').textContent = body.topPlace
  document.getElementById('topInvestigator').textContent = body.topInvestigator
  document.getElementById('highSpookiness').textContent = body.highSpookiness
}

async function loadTable() {
  const { body } = await json('/api/sightings')
  const tbody = document.getElementById('rows')
  if (!tbody || !Array.isArray(body)) return
  tbody.innerHTML = ''
  for (const s of body) {
    const tr = document.createElement('tr')
    // BUG E: column reads "s.spooky" which is undefined instead of "s.spookiness".
    tr.innerHTML = `<td>${s.id}</td><td>${s.place}</td><td>${s.investigator_name}</td><td>${s.spookiness}</td>`
    tbody.appendChild(tr)
  }
}

loadStats()
loadTable()
