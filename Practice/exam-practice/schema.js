export async function createSchema(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS items (
      id       SERIAL PRIMARY KEY,
      name     TEXT NOT NULL,
      category TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS borrowings (
      id           SERIAL PRIMARY KEY,
      item_id      INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
      student_name TEXT NOT NULL,
      days         INTEGER NOT NULL,
      borrowed_at  TIMESTAMPTZ DEFAULT now()
    );
  `)
}
