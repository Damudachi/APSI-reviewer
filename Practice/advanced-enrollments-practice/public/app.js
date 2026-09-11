// public/app.js - Dashboard script.
async function json(url) { const r = await fetch(url); return { status: r.status, body: await r.json().catch(() => null) } }

async function loadStats() {
  const { body } = await json('/api/stats')
  document.getElementById('total').textContent = body.total
  document.getElementById('avgGrade').textContent = body.avgGrade
  document.getElementById('ungraded').textContent = body.ungraded
  document.getElementById('topInstructor').textContent = body.topInstructor
}

async function loadTable() {
  const { body } = await json('/api/enrollments')
  const tbody = document.getElementById('rows')
  tbody.innerHTML = ''
  for (const s of body.slice(0, 25)) {
    const tr = document.createElement('tr')
    // BUG E: reads s.student instead of s.student_name, causing Student Name column to be "undefined".
    tr.innerHTML = `<td>${s.id}</td><td>${s.student}</td><td>${s.grade_score ?? 'N/A'}</td><td>${s.course_id}</td><td>${(s.enrolled_date || '').slice(0, 10)}</td>`
    tbody.appendChild(tr)
  }
}

document.getElementById('filterBtn').onclick = async () => {
  const dept = document.getElementById('deptInput').value
  const { body } = await json('/api/enrollments/search?dept=' + encodeURIComponent(dept))
  document.getElementById('filterResult').textContent = Array.isArray(body) ? `${body.length} enrollments` : 'error'
}

document.getElementById('lookupBtn').onclick = async () => {
  const id = document.getElementById('idInput').value
  const { status, body } = await json('/api/enrollments/' + encodeURIComponent(id))
  const el = document.getElementById('lookupResult')
  if (status === 404) el.textContent = 'No enrollment with that id.'
  else if (body && body.student_name) el.textContent = `Enrollment ${body.id}: ${body.student_name}, grade: ${body.grade_score ?? 'N/A'}`
  else el.textContent = 'The look-up route is not working yet.'
}

loadStats(); loadTable()
