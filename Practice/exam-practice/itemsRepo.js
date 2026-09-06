// Data access layer for items table
// Remember: Repos talk to PostgreSQL using parameterized queries ($1, $2)

export async function create(pool, { name, category }) {
  const { rows } = await pool.query(
    `INSERT INTO items (name, category) VALUES ($1, $2) RETURNING *`,
    [name, category]
  )
  return rows[0]
}

export async function getAll(pool) {
  const { rows } = await pool.query(`SELECT * FROM items ORDER BY id`)
  return rows
}

export async function getById(pool, id) {
  const { rows } = await pool.query(`SELECT * FROM items WHERE id = $1`, [id])
  return rows[0] || null
}
