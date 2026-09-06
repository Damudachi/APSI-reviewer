// Module 5 - Activity 4 - the schema: TWO related tables.
//
// Until now the app had one table. Now a sighting is reported BY somebody, so
// there are two: investigators (the people) and sightings (what they saw). The
// link between them is a FOREIGN KEY - research that term before you write any
// SQL here, along with SERIAL, NOT NULL, UNIQUE and ON DELETE CASCADE.
//
// The contract the tests rely on:
//
//   investigators: id, name, email
//   sightings:     id, investigator_id, place, description, spookiness
//
// Two rules the DATABASE itself has to enforce (not your routes):
//   - a sighting can never point at an investigator id that does not exist
//   - two investigators can never share the same email
//
// Order matters: a table cannot reference a table that does not exist yet.

export async function createSchema(pool) {
  // TODO: CREATE TABLE IF NOT EXISTS investigators (...)
  //   id is a generated integer primary key, name and email are required text,
  //   and email is unique.
  await pool.query(`CREATE TABLE IF NOT EXISTS investigators (
        id    SERIAL PRIMARY KEY,
        name  TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
  )`)

  // TODO: CREATE TABLE IF NOT EXISTS sightings (...)
  //   id is a generated integer primary key; investigator_id is a required
  //   integer that REFERENCES the investigators table; place is required text;
  //   description is optional text; spookiness is a required integer.
  await pool.query(`CREATE TABLE IF NOT EXISTS sightings (
    id          SERIAL PRIMARY KEY,
    investigator_id   INTEGER NOT NULL REFERENCES investigators(id) ON DELETE CASCADE,
    place       TEXT NOT NULL,
    description TEXT,
    spookiness  INTEGER NOT NULL,
    reported_at TIMESTAMPTZ DEFAULT now() 
  )`)
}
