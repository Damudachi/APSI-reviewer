// PROVIDED for you: the data-access layer you built in m5a2.
//
// This is the "SQL half" of the app, given to you complete so you can focus on
// the "HTTP half" (the Express routes in app.js). Your job in this capstone is to
// call these functions from your routes - not to rewrite them. Notice every
// query is parameterized ($1, $2, ...); keep that discipline in your routes too.

export async function createSchema(pool) {
  await pool.query(`CREATE TABLE IF NOT EXISTS sightings (
    id          SERIAL PRIMARY KEY,
    place       TEXT NOT NULL,
    description TEXT,
    spookiness  INTEGER NOT NULL,
    reported_at TIMESTAMPTZ DEFAULT now()
  )`)
}

export async function create(pool, { place, description, spookiness }) {
  const result = await pool.query(
    `INSERT INTO sightings (place, description, spookiness)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [place, description ?? null, spookiness]
  )
  return result.rows[0]
}

export async function getAll(pool) {
  const result = await pool.query('SELECT * FROM sightings ORDER BY id')
  return result.rows
}

export async function getById(pool, id) {
  const result = await pool.query('SELECT * FROM sightings WHERE id = $1', [id])
  return result.rows[0] ?? null
}

export async function update(pool, id, { place, description, spookiness }) {
  const result = await pool.query(
    `UPDATE sightings
     SET place = $1, description = $2, spookiness = $3
     WHERE id = $4
     RETURNING *`,
    [place, description ?? null, spookiness, id]
  )
  return result.rows[0] ?? null
}

export async function remove(pool, id) {
  const result = await pool.query('DELETE FROM sightings WHERE id = $1 RETURNING id', [id])
  return result.rows.length > 0
}
