// Data access for the sightings table.
//
// The new idea here is the JOIN. A sighting row only stores investigator_id - a
// number. That is useless to whoever calls the API, so every READ in this file
// must return the reporter's name alongside the sighting, in a column named
// exactly:
//
//   investigator_name
//
// Research: JOIN ... ON, and column aliases (SELECT i.name AS investigator_name).
// One SELECT with a JOIN can serve all three reads below - write it once and
// reuse it rather than repeating yourself.
//
// Parameterized queries only, same as always.

// Reusable base query for all reads to avoid repetition and enforce the exact column name alias
const BASE_READ_QUERY = `
  SELECT s.*, i.name AS investigator_name 
  FROM sightings s 
  JOIN investigators i ON s.investigator_id = i.id
`;

export async function create(pool, { investigator_id, place, description, spookiness }) {
  // description is optional: store null when it is missing.
  const { rows } = await pool.query(
    `INSERT INTO sightings (investigator_id, place, description, spookiness) 
     VALUES ($1, $2, $3, $4) 
     RETURNING *`, 
    [investigator_id, place, description ?? null, spookiness]
  );
  return rows[0];
}

export async function getAll(pool, { minSpookiness } = {}) {
  // Return every sighting, each with its investigator_name, ordered by id.
  let querytext = BASE_READ_QUERY;
  const params = [];

  if (minSpookiness !== undefined) {
    querytext += ' WHERE s.spookiness >= $1';
    params.push(minSpookiness);
  }

  querytext += ' ORDER BY s.id';

  const { rows } = await pool.query(querytext, params);
  return rows;
} 

export async function getById(pool, id) {
  // Return the one sighting with this id, including investigator_name, or null.
  const { rows } = await pool.query(
    `${BASE_READ_QUERY} WHERE s.id = $1`, 
    [id]
  );
  return rows[0] || null;
}

export async function getByInvestigator(pool, investigatorId) {
  // Return every sighting reported by this investigator, ordered by id.
  const { rows } = await pool.query(
    `${BASE_READ_QUERY} WHERE s.investigator_id = $1 ORDER BY s.id`, 
    [investigatorId]
  );
  return rows;
}

export async function update(pool, id, { place, description, spookiness }) {
  // UPDATE the sighting and return it in the SAME shape as the other reads.
  // Fixed typo: changed 'descriptions' to 'description'.
  // Fixed typo: removed array missing brackets in params mapping.
  const { rowCount } = await pool.query(
    `UPDATE sightings 
     SET place = $1, description = $2, spookiness = $3 
     WHERE id = $4`, 
    [place, description ?? null, spookiness, id]
  );
  
  if (rowCount === 0) return null;

  return await getById(pool, id);
}

export async function remove(pool, id) {
  // DELETE the sighting. Return true when a row was actually deleted and false when not.
  const { rowCount } = await pool.query(
    `DELETE FROM sightings WHERE id = $1`, 
    [id]
  );
  return rowCount > 0;
}
