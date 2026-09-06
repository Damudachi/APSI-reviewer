# 03 - Connecting Node to PostgreSQL

## The one-sentence answer

**`pg` (node-postgres) is the library that lets your Node app talk to Postgres:**
you connect, send SQL with values kept separate from the query, and get rows
back. This doc also covers the single most important safety rule in database
code - **parameterized queries**.

## The `pg` library

`pg` is the standard PostgreSQL driver for Node. Install it:

```bash
npm install pg
```

It gives you two ways to connect - a **Client** (one connection) and a **Pool**
(a managed set of reusable connections).

### Client vs Pool

- A **`Client`** is a single connection. You `connect()`, run queries, and `end()`.
  Fine for a script or a test.
- A **`Pool`** keeps a handful of connections open and hands one out per query,
  reusing them. **Use a Pool for a web server** - opening a fresh connection per
  request is slow, and a pool handles many concurrent requests cleanly.

```js
import pg from 'pg'
const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // postgresql://user:pass@host:5432/db
})

const result = await pool.query('SELECT * FROM sightings')
console.log(result.rows) // an array of row objects
```

`pool.query(...)` returns a **result object**; the part you almost always want is
**`result.rows`** - an array of plain objects, one per row.

## Keep secrets in the environment

Your connection string holds a password, so it must **not** be hard-coded in a
file you commit. It goes in an **environment variable**, read via
`process.env.DATABASE_URL`. Locally you keep it in a **`.env`** file that is
**git-ignored**:

```
# .env  (never committed)
DATABASE_URL=postgresql://user:password@localhost:5432/haunted
```

This is the same reason `student.json` is fine to commit (no secrets) but a
`.env` never is.

## Parameterized queries (read this twice)

Here is the tempting, **wrong** way to put a value into a query - by gluing
strings together:

```js
// DANGER: never do this
const q = `SELECT * FROM sightings WHERE place = '${userInput}'`
await pool.query(q)
```

If `userInput` is `x'; DROP TABLE sightings; --`, you just handed an attacker the
ability to run their own SQL. This is **SQL injection**, and it is one of the most
common serious web vulnerabilities.

The fix is a **parameterized query**: write **placeholders** (`$1`, `$2`, ...) in
the SQL and pass the values as a **separate array**. The driver sends the query
and the values apart, so a value can never be interpreted as SQL:

```js
// SAFE: values are parameters, not string concatenation
await pool.query(
  'SELECT * FROM sightings WHERE place = $1',
  [userInput]
)

await pool.query(
  'INSERT INTO sightings (place, spookiness) VALUES ($1, $2) RETURNING *',
  ['Old gym', 5]
)
```

Postgres uses **`$1`, `$2`, `$3`** (numbered), matched positionally to the array.
**Rule: any value that comes from a user goes in via `$n` + the values array -
never inside the query string.** This is non-negotiable, and the m5 rubric checks
for it.

## RETURNING: get the row back

Postgres can hand you the affected row after a write, so you don't need a second
query. Add **`RETURNING *`** to an `INSERT`/`UPDATE`/`DELETE`:

```js
const result = await pool.query(
  'INSERT INTO sightings (place, spookiness) VALUES ($1, $2) RETURNING *',
  ['Library', 4]
)
const created = result.rows[0] // the new row, including its generated id
```

This is exactly how your POST route will get the `201`-created object to send back.

## The shape of a query call

```mermaid
flowchart LR
    Code["pool.query(sql, values)"] --> PG["Postgres runs it safely"]
    PG --> Result["result object"]
    Result --> Rows["result.rows -> array of row objects"]
```

## In one breath, for the exam

> **`pg`** (node-postgres) connects Node to Postgres; use a **`Pool`** for a web
> server and read **`result.rows`**. The connection string lives in an
> **environment variable** (`.env`, git-ignored), never in committed code.
> Always use **parameterized queries** - placeholders **`$1, $2`** with a
> **values array** - to prevent **SQL injection**; never build SQL by string
> concatenation. **`RETURNING *`** gives you the affected row back after a write.

## References

- node-postgres Documentation. *Getting started* and *Connecting*. https://node-postgres.com/
- node-postgres Documentation. *Queries (parameterized)*. https://node-postgres.com/features/queries
- node-postgres Documentation. *Pooling*. https://node-postgres.com/features/pooling
- OWASP. *SQL Injection* and *SQL Injection Prevention Cheat Sheet*. https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html
- PostgreSQL Documentation. *RETURNING data from modified rows*. https://www.postgresql.org/docs/current/dml-returning.html
