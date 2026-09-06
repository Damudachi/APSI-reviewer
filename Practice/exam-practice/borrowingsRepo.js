// Data access layer for borrowings table.
// EXAM REQUIREMENT:
// Every READ in this file must JOIN with the items table to include the item's name 
// as a property called `item_name` (e.g. SELECT b.*, i.name AS item_name FROM borrowings b JOIN items i ON b.item_id = i.id).
// Always use parameterized queries ($1, $2, etc.)!

// Base query helper to avoid repeating your JOIN string:
const BASE_READ_QUERY = `
  SELECT b.*, i.name AS item_name
  FROM borrowings b
  JOIN items i ON b.item_id = i.id
`

// TODO 1: Create a new borrowing record and return the inserted row (using RETURNING *)
export async function create(pool, { item_id, student_name, days }) {
  // Your code here
  const { rows } = await pool.query(
    `INSERT INTO borrowings (item_id, student_name , days) VALUES ($1, $2, $3) RETURNING *`
    , [item_id, student_name, days])
  return rows[0];
}

// TODO 2: Get all borrowings (ordered by b.id).
// If options.minDays is provided, filter: WHERE b.days >= $1
export async function getAll(pool, { minDays } = {}) {
  // Your code here
  let query = BASE_READ_QUERY;
  const params = [];

  if (minDays !== undefined) {
    query += ` WHERE b.days >= $1`
    params.push(minDays);
  }
  query += ` ORDER BY b.id ASC`

  const { rows } = await pool.query(query, params)

  return rows;

}



// TODO 3: Get a single borrowing record by id (with item_name joined). Return null if not found.
export async function getById(pool, id) {
  // Your code here
  const { rows } = await pool.query(`SELECT borrowings.*, items.name AS item_name FROM items JOIN borrowings ON items.id = borrowings.item_id WHERE borrowings.id = $1`, [id])

  return rows[0] || null;
}

// TODO 4: Get all borrowings for a specific item_id (ordered by b.id)
export async function getByItem(pool, itemId) {
  // Your code here
  const { rows } = await pool.query(`SELECT b.*, items.name AS item_name FROM borrowings b JOIN items ON items.id = b.item_id WHERE b.item_id = $1 ORDER BY b.id ASC `, [itemId])

  return rows;
}

// TODO 5: Delete a borrowing record by id. Return true if deleted, false if not found.
export async function remove(pool, id) {
  // Your code here
  const { rowCount } = await pool.query(`DELETE FROM borrowings WHERE id = $1`, [id])

  return rowCount > 0;

}
