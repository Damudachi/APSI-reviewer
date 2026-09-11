// sightingsRepo.js - Database Repository Layer
import { pool } from './db.js'

export async function getAll(pool) {
  const result = await pool.query('SELECT s.*, i.name AS investigator_name FROM sightings s JOIN investigators i ON s.investigator_id = i.id ORDER BY s.id ASC')
  return result.rows
}

export async function getById(pool, id) {
  const result = await pool.query('SELECT s.*, i.name AS investigator_name FROM sightings s JOIN investigators i ON s.investigator_id = i.id WHERE s.id = $1', [id])
  return result.rows[0] || null
}

export async function create(pool, { investigator_id, place, description, spookiness }) {
  const result = await pool.query(
    `INSERT INTO sightings (investigator_id, place, description, spookiness)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [investigator_id, place, description ?? null, spookiness]
  )
  return result.rows[0]
}

export async function update(pool, id, { investigator_id, place, description, spookiness }) {
  const result = await pool.query(
    `UPDATE sightings
     SET investigator_id = $1, place = $2, description = $3, spookiness = $4
     WHERE id = $5
     RETURNING *`,
    [investigator_id, place, description ?? null, spookiness, id]
  )
  return result.rows[0] || null
}

export async function remove(pool, id) {
  const result = await pool.query('DELETE FROM sightings WHERE id = $1 RETURNING id', [id])
  return result.rows.length > 0
}
