// Module 5 - Activity 4 - the HTTP layer.
//
// This is the finish line for the midterm: Module 4 (Express, routing,
// middleware, REST design) on top of Module 5 (Postgres, relations, SQL).
//
// THE RULE THAT IS BEING GRADED: routes speak HTTP, repos speak SQL.
// There must be NO SQL in this file, and no req/res in the repo files.
//
// Build createApp(pool) and RETURN the app.

import express from 'express'
import * as investigators from './investigatorsRepo.js'
import * as sightings from './sightingsRepo.js'

// --- middleware -------------------------------------------------------------
// Module 4 taught middleware; this activity is where it gets graded. Research
// the two shapes: a normal middleware (req, res, next) and an ERROR-handling
// middleware, which Express only recognizes by its FOUR arguments.

// TODO: write a middleware that rejects a URL id that is not a number with 400
// and a JSON body, and otherwise calls next(). Use it on every route with an :id
// so no handler has to check the id itself.
function validateId(req, res, next) {
  const { id } = req.params;
  if (isNaN(Number(id))) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  next();
}

// TODO: write the error-handling middleware (four arguments). It answers with
function errorHandler(err, req, res, next) {
  res.status(400).json({ error: err.message || 'Bad request' });
}

// --- validation -------------------------------------------------------------
// TODO: two small helpers that answer "is this body good enough to store?".
// an investigator needs a non-empty name and an email containing "@"
// a sighting needs an integer investigator_id, a non-empty place, and an
// integer spookiness from 1 to 5
function isValidInvestigator(body) {
  if (!body) return false;
  const { name, email } = body;
  if (typeof name !== 'string' || name.trim() === '') return false;
  if (typeof email !== 'string' || !email.includes('@')) return false;
  return true;
}

function isValidSighting(body) {
  if (!body) return false;
  const { investigator_id, place, spookiness } = body;
  if (!Number.isInteger(investigator_id)) return false;
  if (typeof place !== 'string' || place.trim() === '') return false;
  if (!Number.isInteger(spookiness) || spookiness < 1 || spookiness > 5) return false;
  return true;
}

export function createApp(pool) {
  const app = express()
  app.use(express.json())

  // TODO: GET /health -> 200 with { status: 'ok' }.
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' })
  })

  // --- investigators --------------------------------------------------------

  // TODO: GET /investigators -> 200 with every investigator.
  app.get('/investigators', async (req, res, next) => {
    try {
      const allInvestigators = await investigators.getAll(pool);
      res.status(200).json(allInvestigators);
    } catch (err) {
      next(err);
    }
  })

  // TODO: POST /investigators
  // invalid body -> 400
  // the email is already taken -> 409 (research: what does 409 mean?)
  // otherwise -> 201 with the created investigator
  app.post('/investigators', async (req, res, next) => {
    try {
      if (!isValidInvestigator(req.body)) {
        return res.status(400).json({ error: 'Invalid investigator body' });
      }
      const existing = await investigators.getByEmail(pool, req.body.email);
      if (existing) {
        return res.status(409).json({ error: 'Email already taken' });
      }
      const created = await investigators.create(pool, req.body);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  })

  // TODO: GET /investigators/:id/sightings
  // This is a NESTED resource: the sightings that belong to one investigator.
  // no such investigator -> 404
  // otherwise -> 200 with that investigator's sightings
  app.get('/investigators/:id/sightings', validateId, async (req, res, next) => {
    try {
      const investigator = await investigators.getById(pool, req.params.id);
      if (!investigator) {
        return res.status(404).json({ error: 'Investigator not found' });
      }
      const investigatorSightings = await sightings.getByInvestigator(pool, req.params.id);
      res.status(200).json(investigatorSightings);
    } catch (err) {
      next(err);
    }
  })

  // --- sightings ------------------------------------------------------------

  // TODO: GET /sightings -> 200 with every sighting.
  // It also accepts a query parameter: /sightings?minSpookiness=4 returns only
  // the sightings at or above that level. Remember req.query values arrive as
  // STRINGS. A minSpookiness that is not a number is a 400.
  app.get('/sightings', async (req, res, next) => {
    try {
      let minSpookiness = undefined;
      if (req.query.minSpookiness !== undefined) {
        minSpookiness = Number(req.query.minSpookiness);
        if (isNaN(minSpookiness)) {
          return res.status(400).json({ error: 'Invalid minSpookiness parameter' });
        }
      }
      const allSightings = await sightings.getAll(pool, { minSpookiness });
      res.status(200).json(allSightings);
    } catch (err) {
      next(err);
    }
  })

  // TODO: GET /sightings/:id -> 200 with the sighting, or 404.
  app.get('/sightings/:id', validateId, async (req, res, next) => {
    try {
      const sighting = await sightings.getById(pool, req.params.id);
      if (!sighting) {
        return res.status(404).json({ error: 'Sighting not found' });
      }
      res.status(200).json(sighting);
    } catch (err) {
      next(err);
    }
  })

  // TODO: POST /sightings
  // invalid body -> 400
  // investigator_id that does not exist -> 400 (say so in the error message;
  // do not let the database raise it)
  // otherwise -> 201 with the created sighting
  app.post('/sightings', async (req, res, next) => {
    try {
      if (!isValidSighting(req.body)) {
        return res.status(400).json({ error: 'Invalid sighting body' });
      }
      const investigator = await investigators.getById(pool, req.body.investigator_id);
      if (!investigator) {
        return res.status(400).json({ error: 'Investigator does not exist' });
      }
      const created = await sightings.create(pool, req.body);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  })
  // TODO: DELETE /sightings/:id -> delete the sighting.
  app.delete('/sightings/:id', validateId, async (req, res, next) => {
    try {
      const deleted = await sightings.remove(pool, req.params.id);  
      if (!deleted) {
        return res.status(404).json({ error: 'Sighting not found' });
      }
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });
    // TODO: PATCH /sightings/:id -> merge the body over the existing sighting.
  // no such sighting -> 404, otherwise 200 with the updated sighting.
  app.patch('/sightings/:id', validateId, async (req, res, next) => {
    try {
      const { id } = req.params;
      
      // Look up the existing sighting first
      const existingSighting = await sightings.getById(pool, id);
      if (!existingSighting) {
        return res.status(404).json({ error: 'Sighting not found' });
      }

      // Merge incoming body changes over the existing data record
      const mergedSighting = { ...existingSighting, ...req.body };

      // Validate the completely merged structure before executing database write
      if (!isValidSighting(mergedSighting)) {
        return res.status(400).json({ error: 'Invalid update values for sighting' });
      }

      // Ensure that if the investigator_id is updating, that target investigator actually exists
      if (req.body.investigator_id !== undefined) {
        const investigator = await investigators.getById(pool, req.body.investigator_id);
        if (!investigator) {
          return res.status(400).json({ error: 'Investigator does not exist' });
        }
      }

      // Execute update step via repository block
      const updatedSighting = await sightings.update(pool, id, mergedSighting);
      res.status(200).json(updatedSighting);
    } catch (err) {
      next(err);
    }
  });

  // CRITICAL: Error handling middleware must be attached LAST to catch all next(err) bubbles
  app.use(errorHandler);

  return app;
}


