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

// TODO: export async `create(pool, { place, description, spookiness })` -
// parameterized INSERT ... RETURNING *; return the created row.

// TODO: export async `getAll(pool)` - SELECT every row (ORDER BY id); return the
// array (result.rows), which may be empty.

// TODO: export async `getById(pool, id)` - parameterized SELECT ... WHERE id = $1;
// return the row, or null if none matches.

// TODO: export async `update(pool, id, { place, description, spookiness })` -
// parameterized UPDATE ... WHERE id = $n RETURNING *; return the updated row, or
// null if that id did not exist.

// TODO: export async `remove(pool, id)` - parameterized DELETE ... WHERE id = $1
// RETURNING id; return true if a row was deleted, false otherwise.
