// Module 5 - Activity 2 - PostgreSQL CRUD (the data-access layer)

export async function createSchema(pool) {
  const query = `
    CREATE TABLE IF NOT EXISTS sightings (
      id SERIAL PRIMARY KEY, 
      place TEXT NOT NULL, 
      description TEXT,
      spookiness INTEGER NOT NULL, 
      reported_at TIMESTAMPTZ DEFAULT now()
    )
  `
  await pool.query(query)
}

export async function create(pool, { place, description, spookiness }) {
  const query = `
    INSERT INTO sightings (place, description, spookiness) 
    VALUES ($1, $2, $3) 
    RETURNING *
  `
  const result = await pool.query(query, [place, description ?? null, spookiness])
  return result.rows[0]
}

export async function getAll(pool) {
  const query = 'SELECT * FROM sightings ORDER BY id'
  const result = await pool.query(query)
  return result.rows
}

export async function getById(pool, id) {
  const query = 'SELECT * FROM sightings WHERE id = $1'
  const result = await pool.query(query, [id])
  return result.rows.length > 0 ? result.rows[0] : null
}

export async function update(pool, id, { place, description, spookiness }) {
  const query = `
    UPDATE sightings 
    SET place = $1, description = $2, spookiness = $3 
    WHERE id = $4 
    RETURNING *
  `
  const result = await pool.query(query, [place, description ?? null, spookiness, id])
  return result.rows.length > 0 ? result.rows[0] : null
}

export async function remove(pool, id) {
  const query = 'DELETE FROM sightings WHERE id = $1 RETURNING id'
  const result = await pool.query(query, [id])
  return result.rows.length > 0
}
