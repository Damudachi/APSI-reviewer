// Module 5 - Activity 1 - SQL and connecting to PostgreSQL
//
// Give the HAUnted Sightings app a real table. You will write three functions
// that take a connected `pg` client and run SQL against it. The tests hand you an
// in-memory Postgres, and the same code works against a real one (see db.js).
//
// GOLDEN RULE: never build SQL by gluing strings together. Any value goes in as a
// parameter ($1, $2, ...) with a separate values array. Read db-theory/03 (the
// "parameterized queries" section) before you write a single query.

// TODO: export an async function `createSchema(client)` that creates the table
// if it does not exist:
//   CREATE TABLE IF NOT EXISTS sightings (
//     id          SERIAL PRIMARY KEY,
//     place       TEXT NOT NULL,
//     description TEXT,
//     spookiness  INTEGER NOT NULL,
//     reported_at TIMESTAMPTZ DEFAULT now()
//   )
// Use client.query(sql). No parameters are needed here.

export async function createSchema(client) {
  const sql = `
    CREATE TABLE IF NOT EXISTS sightings (
      id          SERIAL PRIMARY KEY,
      place       TEXT NOT NULL,
      description TEXT,
      spookiness  INTEGER NOT NULL,
      reported_at TIMESTAMPTZ DEFAULT now()
    )
  `;
  
  await client.query(sql);
}
// TODO: export an async function `insertSighting(client, { place, description,
// spookiness })` that INSERTs one row using PARAMETERIZED values ($1, $2, $3) and
// `RETURNING *`, then returns the created row (result.rows[0]).
export async function insertSighting(client, { place, description, spookiness }) {
  const sql = `
    INSERT INTO sightings (place, description, spookiness)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  
  // The array elements correspond to $1, $2, $3
  const values = [place, description, spookiness];
  
  const result = await client.query(sql, values);
  
  // result.rows is an array of all returned rows. We only inserted one, so we want the first item.
  return result.rows[0];
}
// TODO: export an async function `getSighting(client, id)` that SELECTs the row
// WHERE id = $1 (parameterized) and returns it, or null if there is no match
// (result.rows[0] ?? null).
export async function getSighting(client, id) {
  const sql = `
    SELECT * FROM sightings
    WHERE id = $1
  `;
  
  const values = [id];
  const result = await client.query(sql, values);
  
  // If result.rows[0] is undefined, it falls back to null
  return result.rows[0] ?? null;
}