// public/app.js - the dashboard. It fetches the API and fills the page.
// There is ONE bug in here (see the table). Everything else is correct.
async function json(url) { const r = await fetch(url); return { status: r.status, body: await r.json().catch(() => null) } }

async function loadStats() {
  const { body } = await json('/api/stats')
  document.getElementById('total').textContent = body.total
  document.getElementById('topGenre').textContent = body.topGenre
  document.getElementById('longLoans').textContent = body.longLoans
  document.getElementById('topAuthor').textContent = body.topAuthor
}

async function loadTable() {
  const { body } = await json('/api/loans')
  const tbody = document.getElementById('rows')
  tbody.innerHTML = ''
  for (const s of body.slice(0, 25)) {
    const tr = document.createElement('tr')
    // BUG E: one of these reads a field that does not exist on the row, so that
    //        column shows "undefined". Fix the field name.
    tr.innerHTML = `<td>${s.id}</td><td>${s.member}</td><td>${s.days_out}</td><td>${s.book_id}</td><td>${(s.borrowed_at || '').slice(0, 10)}</td>`
    tbody.appendChild(tr)
  }
}

document.getElementById('filterBtn').onclick = async () => {
  const genre = document.getElementById('genreInput').value
  const { body } = await json('/api/loans/search?genre=' + encodeURIComponent(genre))
  document.getElementById('filterResult').textContent = Array.isArray(body) ? `${body.length} loans` : 'error'
}

document.getElementById('lookupBtn').onclick = async () => {
  const id = document.getElementById('idInput').value
  const { status, body } = await json('/api/loans/' + encodeURIComponent(id))
  const el = document.getElementById('lookupResult')
  if (status === 404) el.textContent = 'No loan with that id.'
  else if (body && body.member) el.textContent = `Loan ${body.id}: ${body.member}, ${body.days_out} days out`
  else el.textContent = 'The look-up route is not working yet.'
}

loadStats(); loadTable()
