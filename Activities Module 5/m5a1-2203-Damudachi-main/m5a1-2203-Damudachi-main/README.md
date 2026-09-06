# Module 5 - Activity 1 - SQL and connecting to PostgreSQL

[![Made with Claude](https://img.shields.io/badge/Made_with-Claude-D97757?logo=anthropic&logoColor=white)](https://tjakoen.github.io/notes/ten-times-zero)
![Node.js](https://img.shields.io/badge/Node.js-5FA04E?logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)

The HAUnted Sightings data has been living in a JavaScript array that vanishes on
restart. Module 5 fixes that with a real **PostgreSQL** database. In this first
step you create the `sightings` **table** and write your first SQL queries with
the `pg` (node-postgres) library - and you learn the one rule you must never
break: **parameterized queries**.

> **Read first:**
> [`m5-databases/01-relational-databases-and-sql.md`](../m5-databases/01-relational-databases-and-sql.md),
> [`m5-databases/02-introduction-to-postgresql.md`](../m5-databases/02-introduction-to-postgresql.md),
> and the **parameterized queries** section of
> [`m5-databases/03`](../m5-databases/03-connecting-node-to-postgresql.md).

## No database to install

The tests run against an **in-memory Postgres** (`pg-mem`), so `npm test` works in
any Codespace with zero setup. Your code is identical to what runs against a real
database - `db.js` shows how you would connect to one for real (see also
`.env.example`). Install a real Postgres if you want to *feel* it; you do not need
to for grading.

## What to do

1. **Fill in `student.json`** (identical across your repos; `classCode` matches
   the repo name).
2. **Implement three functions** in [`sightings.js`](sightings.js):
   - `createSchema(client)` - `CREATE TABLE IF NOT EXISTS sightings (...)`
   - `insertSighting(client, sighting)` - a **parameterized** `INSERT ...
     RETURNING *` that returns the created row
   - `getSighting(client, id)` - a **parameterized** `SELECT ... WHERE id = $1`
     that returns the row or `null`

> ⚠️ **Never build SQL with string concatenation.** Values go in as `$1, $2, ...`
> with a separate values array. This prevents SQL injection and is graded from
> Module 5 onward.

## Set up your repo

1. **Use this template -> Create a new repository.**
2. **Owner = the `HAU-6APSI` course org.**
3. **Name it** `m5a1-<classcode>-yourname`.
4. **Make it Private.**

```bash
git clone https://github.com/HAU-6APSI/m5a1-<classcode>-yourname.git
cd m5a1-<classcode>-yourname
```

## Running the tests

```bash
npm install
npm test
```

All tests must pass:

- ✅ `createSchema` builds the table; `insertSighting` returns/persists a row; `getSighting` finds it or returns `null`
- ✅ All six fields in `student.json` are filled in

## Confirm your submission

**Pushing your work is how you submit it.**

```bash
git add -A
git commit -m "Module 5 Activity 1 complete"
git push
```

Then open the **Actions** tab and confirm the green ✅ **Autograde** run.

## 💻 Work in a Codespace (recommended)

Already configured here - no local install. Open one: green **Code** button →
**Codespaces** → **Create codespace on main**. Nicer in VS Code Desktop
(☰ → **Open in VS Code Desktop**).

### ⏱️ Make your free hours last (please read)

1. **Idle timeout 10 min:** **github.com/settings/codespaces → Default idle
   timeout → 10 minutes → Save.**
2. **Stop it when you finish** (**github.com/codespaces → ••• → Stop codespace**).
3. **Delete the Codespace once submitted** (**github.com/codespaces → ••• →
   Delete**).

---
📚 **These materials were authored by [tjakoen](https://github.com/tjakoen), built with Claude.** I use AI in the open, and I expect you to use it to learn the material, not to skip the learning. [How I actually work with AI →](https://tjakoen.github.io/notes/ten-times-zero)
