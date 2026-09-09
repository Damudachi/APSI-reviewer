// Module 5 - Activity 2 - PostgreSQL CRUD (the data-access layer)
//
// This is the full data-access layer for HAUnted Sightings: every database
// operation the app needs, as one focused module. In the capstone (m5a3) your
// Express routes will call these functions - the routes handle HTTP, this module
// handles SQL, and the two never mix.
//
// GOLDEN RULE (graded): every value goes in as a PARAMETER ($1, $2, ...), never
// by string concatenation. Read db-theory/04 for the full CRUD-in-SQL pattern.

// TODO: export async `createSchema(pool)` - CREATE TABLE IF NOT EXISTS sightings
// (id SERIAL PRIMARY KEY, place TEXT NOT NULL, description TEXT,
//  spookiness INTEGER NOT NULL, reported_at TIMESTAMPTZ DEFAULT now()).
export async function createSchema(pool) {
    const query = `
    CREATE TABLE IF NOT EXISTS sightings (
      id          SERIAL PRIMARY KEY,
      place       TEXT NOT NULL,
      description TEXT,
      spookiness  INTEGER NOT NULL,
      reported_at TIMESTAMPTZ DEFAULT now()
    )
  `
    await pool.query(query)
}

// TODO: export async `create(pool, { place, description, spookiness })` -
// parameterized INSERT ... RETURNING *; return the created row.
export async function create(pool, { place, description, spookiness }) {
    const result = await pool.query(`INSERT into sightings (place, description, spookiness) VALUES ($1, $2, $3) RETURNING *`, [place, description ?? null, spookiness])
    return result.rows[0]
}
// TODO: export async `getAll(pool)` - SELECT every row (ORDER BY id); return the
// array (result.rows), which may be empty.
export async function getAll(pool) {
    const result = await pool.query(`SELECT * FROM sightings ORDER BY id ASC`)

    return result.rows
}
// TODO: export async `getById(pool, id)` - parameterized SELECT ... WHERE id = $1;
// return the row, or null if none matches.
export async function getById(pool, id) {
    const result = await pool.query(`SELECT * FROM sightings WHERE id = $1`, [id])
    return result.rows[0] || null
}
// TODO: export async `update(pool, id, { place, description, spookiness })` -
// parameterized UPDATE ... WHERE id = $n RETURNING *; return the updated row, or
// null if that id did not exist.

export async function update(pool, id, { place, description, spookiness }) {
    const result = await pool.query(`UPDATE sightings 
     SET place = $1, description = $2, spookiness = $3 
     WHERE id = $4 
     RETURNING *`, [place, description ?? null, spookiness, id])
    return result.rows[0] || null
}

// TODO: export async `remove(pool, id)` - parameterized DELETE ... WHERE id = $1
// RETURNING id; return true if a row was deleted, false otherwise.
export async function remove(pool, id) {
    const result = await pool.query(`DELETE FROM sightings WHERE id = $1 RETURNING id`, [id])

    return result.rows.length > 0
}