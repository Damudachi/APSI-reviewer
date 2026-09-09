# 🎓 APSI Backend Practical Midterm Exam Study Guide & Cheat Sheet

**Tech Stack:** Node.js, Express.js, PostgreSQL (`pg`), RESTful APIs

---

## 🚦 1. When to use `app.use()`, `app.get()`, `app.post()`, `app.patch()`, and `app.delete()`

| Express Method | HTTP Verb | Purpose | Example Use Case | Status Code |
| :--- | :--- | :--- | :--- | :--- |
| **`app.use()`** | **ALL** (Any) | Global middleware & fallback handlers | Body parsing (`express.json()`), custom logging, response headers (`X-Api`), 404 fallback, error handler. | N/A (or 404/500) |
| **`app.get()`** | **GET** | Read / Fetch data | `GET /sightings`, `GET /sightings/:id`, `GET /health` | **200 OK** |
| **`app.post()`** | **POST** | Create new resource | `POST /sightings` (validate body, insert row/push array) | **201 Created** |
| **`app.patch()`**| **PATCH** | Partial update | `PATCH /sightings/:id` (merge fields over existing row) | **200 OK** |
| **`app.delete()`**| **DELETE** | Delete resource | `DELETE /sightings/:id` (remove row/item) | **204 No Content** |

---

## 🚨 2. My Personal Exam Mistakes & Anti-Patterns Checklist

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

## 🏛️ 3. The Core Architecture Rule: Layering

> ⚠️ **CRITICAL EXAM RULE:** Keep HTTP logic and SQL logic strictly separated.
> - **Routes (`app.js`)**: Speak HTTP. Use `req`, `res`, validate inputs, call repo functions, send status codes. **NO raw SQL in routes!**
> - **Repositories (`*Repo.js`)**: Speak SQL. Receive `pool` and arguments, run `pool.query()`, return JavaScript objects/arrays. **NO `req` or `res` in repos!**

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

### Parameterized Queries & SQL Injection Defense
**NEVER** concatenate user input into SQL strings! Always use placeholders `$1, $2, ...` and pass values in a separate array.

```javascript
// ❌ WRONG (Vulnerable to SQL Injection!):
await pool.query(`SELECT * FROM borrowings WHERE student_name = '${userInput}'`)

// 🟢 SAFE (Parameterized Query):
await pool.query('SELECT * FROM borrowings WHERE student_name = $1', [userInput])
```

---

## 🛠️ 5. Standard Route Handler Patterns

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

### 3. `PATCH /items/:id` (Partial Update)
```javascript
app.patch('/items/:id', async (req, res, next) => {
  try {
    const existing = await itemsRepo.getById(pool, req.params.id)
    if (!existing) {
      return res.status(404).json({ error: 'Item not found' })
    }
    const merged = { ...existing, ...req.body }
    const updated = await itemsRepo.update(pool, req.params.id, merged)
    res.status(200).json(updated)
  } catch (err) {
    next(err)
  }
})
```

### 4. `DELETE /items/:id` (Delete)
```javascript
app.delete('/items/:id', async (req, res, next) => {
  try {
    const deleted = await itemsRepo.remove(pool, req.params.id)
    if (!deleted) {
      return res.status(404).json({ error: 'Item not found' })
    }
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})
```

---

**Good luck tomorrow! You've mastered all 4 activities!** 🚀
