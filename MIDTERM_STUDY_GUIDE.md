# 🎓 APSI Backend Practical Midterm Exam Ultimate Master Code Guide

**Tech Stack:** Node.js, Express.js, PostgreSQL (`pg`), RESTful APIs

---

## 🚀 1. The 10-Second Pattern Identifier (Database vs In-Memory)

### 🟢 Pattern A: PostgreSQL Database App (Tomorrow's Exam & Reviewer)
Check the top of `app.js`:
```javascript
import { pool } from './db.js'
// OR
import * as repo from './sightingsRepo.js'
```
👉 **Data lives in PostgreSQL!**
* **MUST USE:** `await pool.query(...)` or `await repo.functionName(...)`
* ❌ **DO NOT USE:** `.find()`, `.push()`, `.splice()`, or JS arrays.

### 🟡 Pattern B: In-Memory Array App (Module 4 Activity 3)
Check inside `createApp()` in `app.js`:
```javascript
const sightings = [ { id: 1, ... }, { id: 2, ... } ]
```
👉 **Data lives in a JavaScript Array!**
* **MUST USE:** `.find()`, `.push()`, `.splice()`, `Object.assign()`.

---

## 🧭 2. Express Request Data: `req.params` vs `req.query` vs `req.body`

| Feature | `req.params` | `req.query` | `req.body` |
| :--- | :--- | :--- | :--- |
| **HTTP Methods** | `GET`, `DELETE`, `PUT`, `PATCH` | `GET` | `POST`, `PUT`, `PATCH` |
| **Where it appears** | In the URL path (`/api/loans/:id`) | In URL query string (`?genre=history`) | Hidden inside HTTP payload body (JSON) |
| **Primary Use** | Identify 1 specific resource ID | Filter / Search / Sort multiple records | Create or Update record in DB |
| **Express Access** | `req.params.id` | `req.query.genre` | `req.body.member` |
| **Needs `await`?** | ❌ **No** (synchronous memory) | ❌ **No** (synchronous memory) | ❌ **No** (synchronous memory) |

> 💡 **Key Rule:** `req.params`, `req.query`, and `req.body` are instant synchronous properties in memory. You only use `await` on asynchronous calls (like `await pool.query(...)` or `await fetch(...)`).

---

## 🛠️ 3. The 6 Ready-to-Use Express Route Code Blocks

### 1️⃣ `GET /api/resource` (List All)
```javascript
app.get('/api/loans', async (req, res) => {
  const result = await pool.query('SELECT * FROM loans ORDER BY id ASC')
  res.status(200).json(result.rows)
})
```

### 2️⃣ `GET /api/resource/:id` (Get One by ID)
```javascript
app.get('/api/loans/:id', async (req, res) => {
  const result = await pool.query('SELECT * FROM loans WHERE id = $1', [req.params.id])
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Loan not found' })
  }
  res.status(200).json(result.rows[0])
})
```

### 3️⃣ `GET /api/resource/search?genre=...` (Query String Filter)
```javascript
app.get('/api/loans/search', async (req, res) => {
  const wanted = req.query.genre // 👈 Match exact URL parameter name (e.g. ?genre=...)
  const result = await pool.query(
    'SELECT l.* FROM loans l JOIN books b ON l.book_id = b.id WHERE b.genre = $1 ORDER BY l.id',
    [wanted]
  )
  res.status(200).json(result.rows)
})
```

### 4️⃣ `POST /api/resource` (Create New Resource)
```javascript
app.post('/api/loans', async (req, res) => {
  const { book_id, member, days_out, borrowed_at } = req.body || {}

  // Safe validation check (prevents undefined.trim() crashes)
  if (!member || typeof member !== 'string' || member.trim() === '' || !book_id) {
    return res.status(400).json({ error: 'Missing or invalid required fields' })
  }

  // MUST INCLUDE 'RETURNING *' to get the created row back!
  const result = await pool.query(
    `INSERT INTO loans (book_id, member, days_out, borrowed_at)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [book_id, member, days_out, borrowed_at || new Date().toISOString()]
  )

  res.status(201).json(result.rows[0])
})
```

### 5️⃣ `PATCH /api/resource/:id` (Partial Update)
```javascript
app.patch('/api/loans/:id', async (req, res) => {
  // 1. Fetch existing record from database
  const existingRes = await pool.query('SELECT * FROM loans WHERE id = $1', [req.params.id])
  if (existingRes.rows.length === 0) {
    return res.status(404).json({ error: 'Loan not found' })
  }

  // 2. Merge incoming fields over existing record
  const merged = { ...existingRes.rows[0], ...req.body }

  // 3. Update database row with RETURNING *
  const updatedRes = await pool.query(
    `UPDATE loans 
     SET book_id = $1, member = $2, days_out = $3, borrowed_at = $4 
     WHERE id = $5 
     RETURNING *`,
    [merged.book_id, merged.member, merged.days_out, merged.borrowed_at, req.params.id]
  )

  res.status(200).json(updatedRes.rows[0])
})
```

### 6️⃣ `DELETE /api/resource/:id` (Delete)
```javascript
app.delete('/api/loans/:id', async (req, res) => {
  // MUST INCLUDE 'RETURNING *' if returning deleted object
  const result = await pool.query('DELETE FROM loans WHERE id = $1 RETURNING *', [req.params.id])
  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Loan not found' })
  }
  res.status(200).json({ message: 'Loan deleted', deleted: result.rows[0] })
  // OR for status 204 No Content: res.status(204).end()
})
```

---

## 🗄️ 4. PostgreSQL Repository Layer Code Blocks (`*Repo.js`)

### 1️⃣ Table Schema Creation (`createSchema`)
```javascript
export async function createSchema(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS investigators (
      id    SERIAL PRIMARY KEY,
      name  TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS sightings (
      id              SERIAL PRIMARY KEY,
      investigator_id INTEGER NOT NULL REFERENCES investigators(id) ON DELETE CASCADE,
      place           TEXT NOT NULL,
      description     TEXT,
      spookiness      INTEGER NOT NULL,
      reported_at     TIMESTAMPTZ DEFAULT now()
    )
  `)
}
```

### 2️⃣ Full CRUD Repo Module (`sightingsRepo.js`)
```javascript
// SELECT ALL
export async function getAll(pool) {
  const result = await pool.query('SELECT * FROM sightings ORDER BY id ASC')
  return result.rows
}

// SELECT BY ID
export async function getById(pool, id) {
  const result = await pool.query('SELECT * FROM sightings WHERE id = $1', [id])
  return result.rows[0] || null
}

// INSERT
export async function create(pool, { place, description, spookiness }) {
  const result = await pool.query(
    `INSERT INTO sightings (place, description, spookiness)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [place, description ?? null, spookiness]
  )
  return result.rows[0]
}

// UPDATE
export async function update(pool, id, { place, description, spookiness }) {
  const result = await pool.query(
    `UPDATE sightings
     SET place = $1, description = $2, spookiness = $3
     WHERE id = $4
     RETURNING *`,
    [place, description ?? null, spookiness, id]
  )
  return result.rows[0] || null
}

// DELETE
export async function remove(pool, id) {
  const result = await pool.query('DELETE FROM sightings WHERE id = $1 RETURNING id', [id])
  return result.rows.length > 0
}
```

---

## 🔍 5. Common SQL & Express Exam Bugs Reference Table

| Bug Type | ❌ Buggy Code | 🟢 Fixed Code | Rationale |
| :--- | :--- | :--- | :--- |
| **1. Sorting Direction** | `ORDER BY count ASC` | `ORDER BY count DESC` | `DESC` puts the highest/most borrowed first. |
| **2. Strict Comparison** | `WHERE days_out >= 14` | `WHERE days_out > 14` | "More than 14" means strictly greater than (`>`). |
| **3. Group By Primary Key** | `GROUP BY b.id` (or `b.id, b.author`) | `GROUP BY b.author` | Grouping by primary key counts courses/books separately instead of consolidating by author/instructor. |
| **4. Query Param Name** | `req.query.g` or `req.params.genre` | `req.query.genre` | Match exact URL parameter name sent after `?` (`?genre=...`). |
| **5. SQL NULL Check** | `WHERE grade_score = NULL` | `WHERE grade_score IS NULL` | In SQL, `= NULL` **always returns false**. You MUST use `IS NULL` or `IS NOT NULL`. |
| **6. Aggregate Function** | `SELECT SUM(score)` | `SELECT AVG(score)::int` | Use `AVG()` for average, `SUM()` for total sum. |
| **7. Missing RETURNING *** | `INSERT ... VALUES ($1)` | `INSERT ... VALUES ($1) RETURNING *` | Without `RETURNING *`, SQL returns 0 rows, so `result.rows[0]` will be `undefined`. |
| **8. Trailing Space in Path** | `app.get('/api/loans/:id ')` | `app.get('/api/loans/:id')` | Extra space inside quotes breaks URL routing matching. |

---

## 🚦 6. REST HTTP Status Codes Map

| Code | Status | Meaning | When to use in Exam |
| :--- | :--- | :--- | :--- |
| **200** | **OK** | Request succeeded | Successful `GET`, `PATCH`, `PUT`, or `DELETE` with JSON body. |
| **201** | **Created** | New resource created | Successful `POST` (return created object). |
| **204** | **No Content** | Deleted successfully | Successful `DELETE` without body (`res.status(204).end()`). |
| **400** | **Bad Request** | Invalid input format | Validation failed, missing required fields, non-numeric ID. |
| **404** | **Not Found** | Resource missing | Record ID not found in database or unknown URL endpoint. |
| **500** | **Server Error** | Server crashed | Exception caught by error middleware (`next(err)`). |

---

## 🚨 7. Personal Exam Mistakes & Anti-Patterns Checklist

1. ⚠️ **Callback Parameter Order `(req, res)`**: Request is ALWAYS 1st, Response is ALWAYS 2nd! `(res, req)` will crash `req.body`.
2. ⚠️ **Do NOT Destructure in Callback Signature**: Write `(req, res) =>`, NOT `(req, res, { field }) =>`.
3. ⚠️ **Safe Field Validation**: Check `!req.body.field` BEFORE calling `.trim()`. Calling `.trim()` on `undefined` causes a fatal TypeError crash!
4. ⚠️ **`res` vs `req` Methods**: Use `res.setHeader('X-Api', 'val')`, NOT `req.setHeader()` or `req.replace()`.
5. ⚠️ **Variable Shadowing**: Don't write `const create = await create(...)`. Use `const created = await create(...)`.
6. ⚠️ **`pg` Result Object**: `pool.query(...)` returns `{ rows, rowCount }`. Assign `const result = await pool.query(...)` and use `result.rows[0]`.
7. ⚠️ **Validation Logic (`&&` vs `||`)**: Inside `!(...)` validation checks, use **`&&` (AND)**, not `||`.
8. ⚠️ **Integer Type Checking**: Use `Number.isInteger(x)`, NOT `typeof x === 'integer'`.
9. ⚠️ **Merging Objects**: Merge objects with `{ ...existing, ...req.body }` (JS objects don't have `.merge()`).
10. ⚠️ **Always `await` DB calls**: All repo calls (`getAll`, `getById`, `create`, `update`, `remove`) MUST use `await`.
11. ⚠️ **`res.status(204).end()`**: Must include parentheses `()` on `.end()`.
12. ⚠️ **`RETURNING *` in SQL**: Always add `RETURNING *` to `INSERT`, `UPDATE`, and `DELETE` queries when you need the modified object returned.
13. ⚠️ **Frontend Property Typo (`public/app.js`)**: Check DB column names (`s.days_out` vs `s.daysout`, `s.student_name` vs `s.student`).
14. ⚠️ **Route Trailing Spaces**: Watch out for spaces in route paths (`'/api/loans/:id '` ❌ vs `'/api/loans/:id'` ✅).
15. ⚠️ **Status Code Typos**: Write `res.status(200).json(...)`, NOT `res.status.json(200)`.

---

**You have everything you need to get an A+! Good luck!** 🚀
