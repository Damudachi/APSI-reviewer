# Module 5 - Activity 3 - REST API backed by PostgreSQL (capstone)

[![Made with Claude](https://img.shields.io/badge/Made_with-Claude-D97757?logo=anthropic&logoColor=white)](https://tjakoen.github.io/notes/ten-times-zero)
![Node.js](https://img.shields.io/badge/Node.js-5FA04E?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)

The finish line. You have a REST API (Module 4) and a Postgres data layer (m5a2).
This capstone **wires them together**: the same HAUnted Sightings API, now backed
by a real database, so its data survives a restart. The data layer is provided
(`sightingsRepo.js`); your job is the **routes** that call it.

> **Read first:**
> [`m5-databases/04-crud-with-postgresql.md`](../m5-databases/04-crud-with-postgresql.md)
> (the "mapping CRUD to REST routes" section) and, if you need a refresher,
> [`m4-backend/05`](../m4-backend/05-restful-design-patterns.md).

## 🎓 This activity is graded (50 points)

**30 automated** (your tests pass) + **20 code quality** (reviewed from your
source). The code-quality half rewards two things above all: **REST correctness**
(right verb, right status code) and clean **layering** (routes do HTTP, the repo
does SQL, and they never mix). Read [`RUBRIC.md`](RUBRIC.md) before you start.

## The architecture

```
HTTP request -> your routes (app.js) -> sightingsRepo.js (provided) -> Postgres
                (status codes, req/res)   (parameterized SQL)
```

Your routes should contain **no SQL**. They call `getAll`, `getById`, `create`,
`update`, and `remove`, and translate the results into HTTP responses.

## What to do

1. **Fill in `student.json`** (identical across your repos; `classCode` matches
   the repo name).
2. **Build `createApp(pool)`** in [`app.js`](app.js): the six routes
   (`/health`, list, read-one, create, update, delete) wired to the provided
   repo, with the correct status codes (201 on create, 204 on delete, 404 on a
   missing id, 400 on invalid input).

Run it for real with a live database: set `DATABASE_URL` (see `.env.example`),
start Postgres, then `npm start` (see `server.js`).

## No database to install for the tests

The tests run against an **in-memory Postgres** (`pg-mem`), so `npm test` works
with zero setup - the same code runs against a real database.

## Set up your repo

1. **Use this template -> Create a new repository.**
2. **Owner = the `HAU-6APSI` course org.**
3. **Name it** `m5a3-<classcode>-yourname`.
4. **Make it Private.**

```bash
git clone https://github.com/HAU-6APSI/m5a3-<classcode>-yourname.git
cd m5a3-<classcode>-yourname
```

## Running the tests

```bash
npm install
npm test
```

All tests must pass:

- ✅ every route behaves per the REST contract, reading and writing through the database
- ✅ All six fields in `student.json` are filled in

## Confirm your submission

**Pushing your work is how you submit it.**

```bash
git add -A
git commit -m "Module 5 Activity 3 complete"
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
