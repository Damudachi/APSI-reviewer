# 🎓 APSI Backend Practical Midterm Exam Ultimate Master Study Guide

**Exam Date & Time:** Tomorrow @ 5:00 PM  
**Tech Stack:** Node.js, Express.js, PostgreSQL (`pg`), RESTful APIs

---

## 🏛️ 1. Core Architecture Rule: Layering

> ⚠️ **CRITICAL EXAM RULE:** Keep HTTP logic and SQL logic strictly separated.
> - **Routes (`app.js`)**: Speak HTTP. Use `req`, `res`, validate inputs, call repo functions, send status codes. **NO raw SQL in routes!**
> - **Repositories (`*Repo.js`)**: Speak SQL. Receive `pool` and arguments, run `pool.query()`, return JavaScript objects/arrays. **NO `req` or `res` in repos!**

---

## 🚦 2. When to use `app.use()`, `app.get()`, `app.post()`, `app.patch()`, and `app.delete()`

| Express Method | HTTP Verb | Purpose | Example Use Case | Status Code |
| :--- | :--- | :--- | :--- | :--- |
| **`app.use()`** | **ALL** (Any) | Global middleware & fallback handlers | Body parsing (`express.json()`), custom logging, response headers (`X-Api`), 404 fallback, error handler. | N/A (or 404/500) |
| **`app.get()`** | **GET** | Read / Fetch data | `GET /sightings`, `GET /sightings/:id`, `GET /health` | **200 OK** |
| **`app.post()`** | **POST** | Create new resource | `POST /sightings` (validate body, insert row/push array) | **201 Created** |
| **`app.patch()`**| **PATCH** | Partial update | `PATCH /sightings/:id` (merge fields over existing row) | **200 OK** |
| **`app.delete()`**| **DELETE** | Delete resource | `DELETE /sightings/:id` (remove row/item) | **204 No Content** |

---

## 📥 3. Express Request Inputs & Middleware Pipeline

### Request Inputs Cheat Sheet

| Client Input Type | Express Property | Example | How to read in Code |
| :--- | :--- | :--- | :--- |
| **URL Path Param (`:id`)** | `req.params` | `GET /items/42` | `req.params.id` (String `'42'`) |
| **URL Query Param (`?key=val`)** | `req.query` | `GET /borrowings?minDays=5` | `req.query.minDays` (String `'5'` or `undefined`) |
| **JSON Request Body** | `req.body` | Sent in POST/PATCH | `req.body.student_name` |

### Custom Middleware (`validateId`)
```javascript
function validateId(req, res, next) {
  const id = Number(req.params.id)
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID format' })
  }
  next() // Pass control to the route handler
}
```

### Error Handling Middleware (4 Arguments)
Express **only** recognizes error middleware if it takes **4 parameters**:
```javascript
function errorHandler(err, req, res, next) {
  return res.status(400).json({ error: err.message || 'Bad request' })
}
```

### Blank `createApp(pool)` 5-Step Boilerplate
```javascript
import express from 'express'

export function createApp(pool) {
  // Step 1: Create application
  const app = express()

  // Step 2: Add JSON parsing middleware
  app.use(express.json())

  // Step 3: Register Route Handlers
  app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }))

  // Step 4: Register Fallback & Error Middleware
  app.use((req, res) => res.status(404).json({ error: 'Not found' }))
  app.use(errorHandler) // Must take 4 arguments: (err, req, res, next)

  // Step 5: Always return app!
  return app
}
```

---

## 🗄️ 4. PostgreSQL & `pg` Database Layer

### Creating Relational Tables (`schema.js`)
```sql
-- Parent Table (Create First!)
CREATE TABLE IF NOT EXISTS items (
  id       SERIAL PRIMARY KEY,           -- Auto-incrementing integer id
  name     TEXT NOT NULL,
  category TEXT NOT NULL
);

-- Child Table (References Parent Table)
CREATE TABLE IF NOT EXISTS borrowings (
  id           SERIAL PRIMARY KEY,
  item_id      INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  days         INTEGER NOT NULL,
  borrowed_at  TIMESTAMPTZ DEFAULT now() -- Defaults to current timestamp
);
```
* **`SERIAL PRIMARY KEY`**: Auto-increments (`1, 2, 3...`). Never pass `id` on `INSERT`.
* **`REFERENCES items(id) ON DELETE CASCADE`**: Enforces foreign key constraint. Automatically deletes child rows if parent row is deleted.

### Parameterized Queries & SQL Injection Defense
**NEVER** concatenate user input into SQL strings! Always use placeholders `$1, $2, ...` and pass values in a separate array.

```javascript
// ❌ WRONG (Vulnerable to SQL Injection!):
await pool.query(`SELECT * FROM borrowings WHERE student_name = '${userInput}'`)

// 🟢 SAFE (Parameterized Query):
await pool.query('SELECT * FROM borrowings WHERE student_name = $1', [userInput])
```

### Key Query Patterns

#### 1. Insert & Return New Row (`RETURNING *`):
```javascript
export async function create(pool, { item_id, student_name, days }) {
  const result = await pool.query(
    `INSERT INTO borrowings (item_id, student_name, days)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [item_id, student_name, days]
  )
  return result.rows[0]
}
```

#### 2. Relational JOIN Query (Attach Parent Properties):
```javascript
// Join child borrowings (b) with parent items (i) to get item_name:
const BASE_READ_QUERY = `
  SELECT b.*, i.name AS item_name
  FROM borrowings b
  JOIN items i ON b.item_id = i.id
`

export async function getById(pool, id) {
  const result = await pool.query(
    `${BASE_READ_QUERY} WHERE b.id = $1`,
    [id]
  )
  return result.rows[0] || null
}
```

#### 3. Dynamic Query String Filtering:
```javascript
export async function getAll(pool, { minDays } = {}) {
  let query = BASE_READ_QUERY
  const params = []

  if (minDays !== undefined) {
    query += ' WHERE b.days >= $1'  // 👈 Space before WHERE is mandatory!
    params.push(minDays)
  }

  query += ' ORDER BY b.id ASC'     // 👈 Space before ORDER BY is mandatory!

  const result = await pool.query(query, params)
  return result.rows
}
```

#### 4. Delete Row (`rows.length > 0`):
```javascript
export async function remove(pool, id) {
  const result = await pool.query('DELETE FROM borrowings WHERE id = $1 RETURNING id', [id])
  return result.rows.length > 0
}
```

---

## 🚦 5. REST HTTP Status Codes Map

| Code | Status | Meaning | When to use in Exam |
| :--- | :--- | :--- | :--- |
| **200** | **OK** | Request succeeded | Successful `GET`, `PATCH`, or `PUT`. |
| **201** | **Created** | New resource created | Successful `POST` (return created object). |
| **204** | **No Content** | Deleted successfully | Successful `DELETE` (no body, `res.status(204).end()`). |
| **400** | **Bad Request** | Invalid input format | Validation failed, missing required fields, non-numeric ID/query param. |
| **404** | **Not Found** | Resource missing | Record ID not found in database or unknown URL endpoint. |
| **409** | **Conflict** | Unique field duplicate | Creating user/investigator with an email that is already registered. |
| **500** | **Server Error** | Server crashed | Internal exception caught by error middleware (`next(err)`). |

---

## 🛠️ 6. Complete Standard Route Handler Patterns

### 1. `GET /items` (List All)
```javascript
app.get('/items', async (req, res, next) => {
  try {
    const items = await itemsRepo.getAll(pool)
    res.status(200).json(items)
  } catch (err) {
    next(err)
  }
})
```

### 2. `POST /items` (Create)
```javascript
app.post('/items', async (req, res, next) => {
  try {
    if (!isValidItem(req.body)) {
      return res.status(400).json({ error: 'Invalid item body' })
    }
    const created = await itemsRepo.create(pool, req.body)
    res.status(201).json(created)
  } catch (err) {
    next(err)
  }
})
```

### 3. `GET /items/:id/borrowings` (Nested Resource)
```javascript
app.get('/items/:id/borrowings', validateId, async (req, res, next) => {
  try {
    const item = await itemsRepo.getById(pool, req.params.id)
    if (!item) {
      return res.status(404).json({ error: 'Item not found' })
    }
    const borrowings = await borrowingsRepo.getByItem(pool, req.params.id)
    res.status(200).json(borrowings)
  } catch (err) {
    next(err)
  }
})
```

### 4. `PATCH /borrowings/:id` (Partial Update)
```javascript
app.patch('/borrowings/:id', validateId, async (req, res, next) => {
  try {
    const existing = await borrowingsRepo.getById(pool, req.params.id)
    if (!existing) {
      return res.status(404).json({ error: 'Borrowing not found' })
    }

    // Merge incoming changes over existing record
    const merged = { ...existing, ...req.body }

    if (!isValidBorrowing(merged)) {
      return res.status(400).json({ error: 'Invalid update body' })
    }

    const updated = await borrowingsRepo.update(pool, req.params.id, merged)
    res.status(200).json(updated)
  } catch (err) {
    next(err)
  }
})
```

### 5. `DELETE /borrowings/:id` (Delete)
```javascript
app.delete('/borrowings/:id', validateId, async (req, res, next) => {
  try {
    const deleted = await borrowingsRepo.remove(pool, req.params.id)
    if (!deleted) {
      return res.status(404).json({ error: 'Borrowing not found' })
    }
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})
```

---

## 🚨 7. Personal Exam Mistakes & Anti-Patterns Checklist

### 1. ⚠️ Callback Parameter Order: `(req, res)`
* ❌ **WRONG:** `app.get('/path', (res, req) => ...)`
* 🟢 **CORRECT:** `app.get('/path', (req, res) => ...)` *(Request is ALWAYS 1st, Response is ALWAYS 2nd!)*

### 2. ⚠️ `req` vs `res` Usage
* **`req` (Request):** Information coming IN from client (`req.body`, `req.params`, `req.query`, `req.method`, `req.path`).
* **`res` (Response):** Sending information OUT to client (`res.status()`, `res.json()`, `res.setHeader('X-Api', 'val')`, `res.status(204).end()`).
* ❌ **WRONG:** `req.replace('X-Api', 'val')` or `req.setHeader()`
* 🟢 **CORRECT:** `res.setHeader('X-Api', 'haunted-sightings')`

### 3. ⚠️ Variable Shadowing with Repo Imports
* ❌ **WRONG:** `const create = await create(pool, req.body)` (shadows imported `create` function, crashes with `TypeError`).
* 🟢 **CORRECT:** `const created = await create(pool, req.body)`

### 4. ⚠️ `pg` Pool Query Returns a Result Object
* ❌ **WRONG:** `const rows = await pool.query(...)` $\rightarrow$ `return rows[0]` (`rows` is the Result Object, so `rows[0]` is undefined).
* 🟢 **CORRECT:** 
  ```javascript
  const result = await pool.query(...)
  return result.rows[0] // or return result.rows
  ```

### 5. ⚠️ Boolean Validation Logic (`&&` vs `||`)
* ❌ **WRONG:** `if (!(typeof place === 'string' || Number.isInteger(spookiness)))` (if spookiness is valid, invalid place slips through!).
* 🟢 **CORRECT:** 
  ```javascript
  if (!place || typeof place !== 'string' || place.trim() === '' ||
      !Number.isInteger(spookiness) || spookiness < 1 || spookiness > 5) {
    return res.status(400).json({ error: 'Invalid input' })
  }
  ```

### 6. ⚠️ Type Checking Integers in JavaScript
* ❌ **WRONG:** `typeof x === 'integer'` (`typeof` returns `'number'`, never `'integer'`).
* 🟢 **CORRECT:** `Number.isInteger(x)`

### 7. ⚠️ Merging Objects for `PATCH`
* ❌ **WRONG:** `req.body.merge(existing)` (JS objects do not have `.merge()`).
* 🟢 **CORRECT:** `const merged = { ...existing, ...req.body }`

### 8. ⚠️ Forgetting `await` on Database Calls
* ❌ **WRONG:** `const row = getById(pool, id)` (returns pending `Promise`).
* 🟢 **CORRECT:** `const row = await getById(pool, id)`

### 9. ⚠️ `DELETE` Status Code & Method Invocation
* ❌ **WRONG:** `res.status(204).end` (missing parentheses `()`).
* 🟢 **CORRECT:** `res.status(204).end()` or `res.sendStatus(204)`

---

**Good luck tomorrow! You've got ALL the knowledge and practice to get an A+!** 🚀
