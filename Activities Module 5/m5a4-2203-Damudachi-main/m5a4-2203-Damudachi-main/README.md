# Module 5 - Activity 4 - Relational REST API (midterm capstone)

[![Made with Claude](https://img.shields.io/badge/Made_with-Claude-D97757?logo=anthropic&logoColor=white)](https://tjakoen.github.io/notes/ten-times-zero)
![Node.js](https://img.shields.io/badge/Node.js-5FA04E?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)

The real finish line. In m5a3 the data layer was handed to you and you wrote the
routes. Here you write **all of it**, and the app grows up: sightings are no
longer floating facts, they are **reported by somebody**. Two tables, related by a
foreign key, read back with a **JOIN**, served over a REST API with real
**middleware**.

> **Read first:**
> [`m5-databases/05-relations-and-joins.md`](../m5-databases/05-relations-and-joins.md)
> (all of it - this activity is that doc), plus
> [`m4-backend/04`](../m4-backend/04-routing-and-middleware.md) for the middleware
> half and [`m4-backend/05`](../m4-backend/05-restful-design-patterns.md) for
> nested resources and query parameters.

## 🎓 This activity is graded (100 points)

**60 automated** (your tests pass) + **40 code quality** (reviewed from your
source). The code-quality half rewards your **relational modeling** (is the
foreign key real, is the JOIN doing the work?) and clean **layering** (routes do
HTTP, repos do SQL, and they never mix). Read [`RUBRIC.md`](RUBRIC.md) before you
start.

## The data model

```
investigators                        sightings
 id (PK)                              id (PK)
 name                                 investigator_id (FK -> investigators.id)
 email (unique)                       place
                                      description
      one  ------------------<  many  spookiness
```

One investigator has many sightings. The database itself must enforce that a
sighting can never point at an investigator who does not exist.

## The architecture

```
HTTP request -> app.js (routes + middleware) -> investigatorsRepo.js  -> Postgres
                (status codes, req/res)         sightingsRepo.js
                                                (parameterized SQL, JOINs)
```

Your routes contain **no SQL**. Your repos contain **no `req`/`res`**.

## The API you are building

| Method | Route | Answers |
| --- | --- | --- |
| GET | `/health` | 200 `{ status: "ok" }` |
| GET | `/investigators` | 200 with every investigator |
| POST | `/investigators` | 201 created, 400 invalid, **409** duplicate email |
| GET | `/investigators/:id/sightings` | 200 with that investigator's sightings, 404 if there is no such investigator |
| GET | `/sightings` | 200 with every sighting, each carrying `investigator_name`; `?minSpookiness=4` narrows it |
| GET | `/sightings/:id` | 200 with the sighting, 404 if missing |
| POST | `/sightings` | 201 created, 400 invalid **or** unknown `investigator_id` |
| PATCH | `/sightings/:id` | 200 updated, 404 if missing |
| DELETE | `/sightings/:id` | 204 no body, 404 if missing |
| any | an id that is not a number | 400, from your middleware |
| any | an unknown route | 404 |

Every read of a sighting returns the reporter's name in a column named exactly
**`investigator_name`**. That name is the contract the tests check.

## What to do

1. **Fill in `student.json`** (identical across your repos; `classCode` matches
   the repo name).
2. **[`schema.js`](schema.js)** - create the two tables, with the foreign key and
   the unique email declared in SQL.
3. **[`investigatorsRepo.js`](investigatorsRepo.js)** and
   **[`sightingsRepo.js`](sightingsRepo.js)** - the data layer, parameterized
   throughout, with the JOIN that carries `investigator_name`.
4. **[`app.js`](app.js)** - the routes, plus two pieces of middleware: the
   numeric-id check and the error handler.

`db.js` and `server.js` are provided. Run it for real with a live database: copy
`.env.example` to `.env`, start Postgres, then `npm start`.

## No database to install for the tests

The tests run against an **in-memory Postgres** (`pg-mem`), so `npm test` works
with zero setup - the same code runs against a real database.

## Set up your repo

1. **Use this template -> Create a new repository.**
2. **Owner = the `HAU-6APSI` course org.**
3. **Name it** `m5a4-<classcode>-yourname`.
4. **Make it Private.**

```bash
git clone https://github.com/HAU-6APSI/m5a4-<classcode>-yourname.git
cd m5a4-<classcode>-yourname
```

## Running the tests

```bash
npm install
npm test
```

All tests must pass:

- ✅ the schema relates the two tables and the database enforces it
- ✅ every route behaves per the REST contract, reading and writing through the database
- ✅ your middleware handles a bad id, a malformed body, and an unknown route
- ✅ All six fields in `student.json` are filled in

## Confirm your submission

**Pushing your work is how you submit it.**

```bash
git add -A
git commit -m "Module 5 Activity 4 complete"
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
