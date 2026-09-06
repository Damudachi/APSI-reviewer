// Module 5 - Activity 2 - PostgreSQL CRUD (the data-access layer)

/**
 * Creates the sightings table if it doesn't already exist.
 */
export async function createSchema(pool) {
  const query = `
    CREATE TABLE IF NOT EXISTS sightings (
      id SERIAL PRIMARY KEY, 
      place TEXT NOT NULL, 
      description TEXT,
      spookiness INTEGER NOT NULL, 
      reported_at TIMESTAMPTZ DEFAULT now()
    )
  `;
  await pool.query(query);
}

/**
 * Inserts a new sighting into the database.
 */
export async function create(pool, { place, description, spookiness }) {
  const query = `
    INSERT INTO sightings (place, description, spookiness) 
    VALUES ($1, $2, $3) 
    RETURNING *
  `;
  const values = [place, description, spookiness];
  const result = await pool.query(query, values);
  
  // Return the newly created row
  return result.rows[0]; 
}

/**
 * Retrieves all sightings, ordered by ID.
 */
export async function getAll(pool) {
  const query = `SELECT * FROM sightings ORDER BY id`;
  const result = await pool.query(query);
  
  // result.rows will naturally be an empty array [] if nothing is found
  return result.rows; 
}

/**
 * Retrieves a single sighting by its ID.
 */
export async function getById(pool, id) {
  const query = `SELECT * FROM sightings WHERE id = $1`;
  const result = await pool.query(query, [id]);
  
  // Return the row if found, otherwise return null
  return result.rows.length > 0 ? result.rows[0] : null;
}

/**
 * Updates an existing sighting by ID.
 */
export async function update(pool, id, { place, description, spookiness }) {
  const query = `
    UPDATE sightings 
    SET place = $1, description = $2, spookiness = $3 
    WHERE id = $4 
    RETURNING *
  `;
  const values = [place, description, spookiness, id];
  const result = await pool.query(query, values);
  
  // Return the updated row if the ID existed, otherwise return null
  return result.rows.length > 0 ? result.rows[0] : null;
}

/**
 * Removes a sighting by ID.
 */
export async function remove(pool, id) {
  const query = `DELETE FROM sightings WHERE id = $1 RETURNING id`;
  const result = await pool.query(query, [id]);
  
  // Return true if a row was actually deleted, false if the ID didn't exist
  return result.rows.length > 0;
}