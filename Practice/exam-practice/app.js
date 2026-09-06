// Module 4 & 5 Practice Exam - Express HTTP & REST Layer
//
// RULE: Routes speak HTTP (req, res, status codes), Repos speak SQL.
// DO NOT write raw SQL in this file! Use the methods from itemsRepo and borrowingsRepo.

import express from 'express'
import * as itemsRepo from './itemsRepo.js'
import * as borrowingsRepo from './borrowingsRepo.js'

// --- Middleware ---

// TODO 1: Middleware to validate route :id parameters.
// If Number(req.params.id) is NaN, respond 400 with { error: 'Invalid ID format' }.
// Otherwise, call next().
function validateId(req, res, next) {
  // Your code here
  const id = Number(req.params.id)

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' })
  } else next()
}

// TODO 2: Error handling middleware (must take 4 arguments: err, req, res, next).
// Respond status 400 with { error: err.message || 'Bad request' }.
function errorHandler(err, req, res, next) {
  // Your code here
  return res.status(400).json({ error: err.message || 'Bad request' })
}

// --- Validation Helpers ---

// TODO 3: Helper function to validate item body
// Body must have non-empty string `name` and non-empty string `category`
function isValidItem(body) {
  // Your code here
  if (!body) return false;
  if (typeof body.name === 'string' && body.name.trim() !== '' && typeof body.category === 'string' && body.category.trim() !== '') {
    return true
  } else return false
}

// TODO 4: Helper function to validate borrowing body
// Body must have integer `item_id`, non-empty string `student_name`, and positive integer `days` (> 0)
function isValidBorrowing(body) {
  // Your code here
  if (!body) return false
  if (Number.isInteger(body.item_id)
    && typeof body.student_name === 'string' && body.student_name.trim() !== ''
    && Number.isInteger(body.days) && body.days > 0
  ) { return true }
  else return false

}

export function createApp(pool) {
  const app = express()
  app.use(express.json())

  // TODO 5: GET /health -> 200 with { status: 'ok' }
  app.get('/health', (req, res) => {
    // Your code here
    res.status(200).json({ status: 'ok' })
  })

  // --- Items Routes ---

  // TODO 6: GET /items -> 200 with all items
  app.get('/items', async (req, res, next) => {
    // Your code here
    try {
      const items = await itemsRepo.getAll(pool);
      res.status(200).json(items)
    } catch (err) {
      next(err)
    }
  })

  // TODO 7: POST /items -> create item. 
  // If invalid body, 400 with { error: 'Invalid item body' }.
  // Otherwise 201 with created item.
  app.post('/items', async (req, res, next) => {
    // Your code here

    try {
      if (!isValidItem(req.body)) {
        return res.status(400).json({
          error: 'Invalid item body'
        })
      }
      const create = await itemsRepo.create(pool, req.body);
      res.status(201).json(create)


    } catch (err) {
      next(err)
    }

  })

  // TODO 8: GET /items/:id/borrowings -> nested resource: borrowings for one item.
  // Validate id with validateId middleware.
  // Check if item exists first. If not, 404 with { error: 'Item not found' }.
  // Otherwise 200 with the item's borrowings array.
  app.get('/items/:id/borrowings', validateId, async (req, res, next) => {
    // Your code here
    try {
      const item = await itemsRepo.getById(pool, req.params.id)
      if (!item) {
        return res.status(404).json({ error: 'Item not found' })
      }

      const borrowings = await borrowingsRepo.getByItem(pool, req.params.id);
      res.status(200).json(borrowings)
    } catch (err) {
      next(err)
    }
  })

  // --- Borrowings Routes ---

  // TODO 9: GET /borrowings -> 200 with all borrowings.
  // Supports optional query parameter: ?minDays=3
  // If minDays query param is present but is NaN, return 400 with { error: 'Invalid minDays parameter' }.
  app.get('/borrowings', async (req, res, next) => {
    // Your code here

    try {
      let minDays = undefined
      if (req.query.minDays !== undefined) {
        minDays = Number(req.query.minDays);
        if (isNaN(minDays)) {
          return res.status(400).json({ error: 'Invalid minDays parameter' })
        }
      }



      const allBorrowings = await borrowingsRepo.getAll(pool, { minDays });
      res.status(200).json(allBorrowings)
    } catch (err) {
      next(err)
    }

  })

  // TODO 10: GET /borrowings/:id -> 200 with single borrowing object (includes item_name), or 404 if not found.
  // Use validateId middleware.
  app.get('/borrowings/:id', validateId, async (req, res, next) => {
    // Your code here
    try {
      const borrow = await borrowingsRepo.getById(pool, req.params.id);
      if (!borrow) {
        return res.status(404).json({ error: 'Item not found' })
      }
      res.status(200).json(borrow)
    } catch (err) {
      next(err)
    }
  })

  // TODO 11: POST /borrowings -> create borrowing.
  // If invalid body, return 400 with { error: 'Invalid borrowing body' }.
  // Check if item_id exists using itemsRepo.getById. If item does not exist, return 400 with { error: 'Item does not exist' }.
  // Otherwise 201 with created borrowing.
  app.post('/borrowings', async (req, res, next) => {
    try {
      // Your code here
      if (!isValidBorrowing(req.body)) {
        return res.status(400).json({ error: 'Invalid borrowing body' })
      }
      const item = await itemsRepo.getById(pool, req.body.item_id)
      if (!item) {
        return res.status(400).json({ error: 'Item does not exist' })
      }
      const createborrowing = await borrowingsRepo.create(pool, req.body)
      res.status(201).json(createborrowing)
    } catch (err) {
      next(err)
    }
  }
  )

  // TODO 12: DELETE /borrowings/:id -> delete borrowing.
  // Use validateId middleware.
  // If borrowing not found, return 404 with { error: 'Borrowing not found' }.
  // Otherwise respond 204 with no body (res.sendStatus(204)).
  app.delete('/borrowings/:id', validateId, async (req, res, next) => {
    // Your code here
    try {
      const deleted = await borrowingsRepo.remove(pool, req.params.id)
      if (!deleted) return res.status(404).json({ error: 'Borrowing not found' })
      res.sendStatus(204)
    } catch (err) {
      next(err)
    }


  })

  // TODO 13: Fallback 404 handler for any unknown endpoint
  app.use((req, res) => {
    // Your code here
    res.status(404).json({ error: 'Not found' })
  })

  // TODO 14: Register error handling middleware (must be last!)
  app.use(errorHandler)

  return app
}
