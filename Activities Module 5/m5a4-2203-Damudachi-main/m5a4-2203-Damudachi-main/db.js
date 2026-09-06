// Provided for you: how you connect to a REAL PostgreSQL database.
//
// You do not need this for the tests (they use an in-memory Postgres), but this
// is the code you would use to run the app against a real database. The
// connection string lives in an environment variable, never in the source - see
// .env.example and db-theory/03.

import pg from 'pg'
const { Pool } = pg

export function createPool() {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
  })
}
