export async function create(pool, { name, email }) {

  const { rows } = await pool.query(
    `INSERT INTO investigators (name, email) VALUES ($1, $2) RETURNING *;`, 
    [name, email]
  );
  return rows[0];
}

export async function getAll(pool) {

  const { rows } = await pool.query(
    `SELECT id, name, email FROM investigators ORDER BY id ASC;`
  );
  return rows;
}

export async function getById(pool, id) {

  const { rows } = await pool.query(
    `SELECT * FROM investigators WHERE id = $1;`, 
    [id]
  );
  return rows[0] || null;
}

export async function getByEmail(pool, email) {

  const { rows } = await pool.query(
    `SELECT * FROM investigators WHERE email = $1;`, 
    [email]
  );
  return rows[0] || null;
}
