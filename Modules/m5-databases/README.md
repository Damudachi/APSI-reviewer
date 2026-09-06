# Module 5 - Databases with PostgreSQL

Module 4 gave you a working API, but its data vanished on every restart. Module 5
fixes that: you give the **HAUnted Sightings** app a real **PostgreSQL** database,
so its data is remembered for good. This is the second half of the midterm, and
its capstone is the moment the whole thing comes together - a real REST API
backed by a real database.

## Where the app is going

```
m4a3  ->  data in a JavaScript array   (lost on restart)
m5    ->  data in a PostgreSQL table    (persistent)
m5a4  ->  data in two RELATED tables    (persistent, and joined up)
```

Same resource, same routes - now the data survives. By m5a4 it also knows how its
pieces fit together: a sighting is reported *by* an investigator, and the database
enforces that link.

## The reading

Read these in order. Each activity tells you which ones it needs; the table under
"The activities" below has the short version.

| # | File | Covers |
| --- | --- | --- |
| 01 | [Relational databases and SQL](01-relational-databases-and-sql.md) | tables/rows/columns, primary keys, schema, persistence, INSERT/SELECT/UPDATE/DELETE, `WHERE` |
| 02 | [Introduction to PostgreSQL](02-introduction-to-postgresql.md) | what an RDBMS is, client/server, port 5432, installing/running, `psql`, connection strings |
| 03 | [Connecting Node to PostgreSQL](03-connecting-node-to-postgresql.md) | the `pg` library, Client vs Pool, env vars/`.env`, **parameterized queries + SQL injection**, `RETURNING` |
| 04 | [CRUD with PostgreSQL](04-crud-with-postgresql.md) | each CRUD op as a parameterized `pg` call, mapping to REST routes, layering routes vs data access, transactions |
| 05 | [Relations, foreign keys and JOINs](05-relations-and-joins.md) | why one table stops being enough, one-to-many, **foreign keys** and referential integrity, `ON DELETE`, **`JOIN`** and aliases, nested resources, query-string filtering |

> Read a section, then come to class ready to talk about it. Nothing here is
> graded directly, but it is the language you will use to reason about every
> database activity - and to make your app remember its data. The **parameterized
> queries** section of 03 is the one rule you must not skip.

The server side is covered in [`../m4-backend/`](../m4-backend/) from Module 4.

## The activities

| Activity | You build | New ideas | Read first | Graded |
| --- | --- | --- | --- | --- |
| **m5a1** - SQL + connecting to Postgres | a schema (`CREATE TABLE sightings`) and your first `insert`/`get` functions with the `pg` library | tables, SQL, node-postgres, **parameterized queries** | 01, 02, 03 | test-only |
| **m5a2** - PostgreSQL CRUD | the full **data-access layer**: `create / getAll / getById / update / remove` against Postgres, with `RETURNING` and not-found handling | complete CRUD in SQL, clean data-access separation | 03, 04 | **points + feedback** |
| **m5a3** - REST API backed by Postgres (capstone) | wire your Module 4 Express routes to the m5a2 data layer: the same API, now persistent | layering routes vs data access, the full request -> route -> SQL -> row path | 04 | **points + feedback** |
| **m5a4** - Relational REST API (midterm capstone) | the whole app yourself: two related tables, both repos, and the routes - sightings are now reported *by* an investigator | **foreign keys**, **JOINs**, nested resources, query-string filtering, **middleware** and error handling | 05, and `m4-backend/04` + `05` | **points + feedback** |
| **m5a5** - HAUnted Sightings client (front end capstone) | the React front end for that API: list, filter, report form, and the loading / error / empty states | fetching a real API from React, `useEffect`, server-side filtering from the UI, designing the states an app actually has | 05, plus your React notes | **points + feedback** |
| **m5a6** - Joins and reporting queries | ten single-query answers about a small library of authors, books and loans: the schema is given, only the SQL is yours | **`LEFT JOIN`** and what a missing match looks like, `GROUP BY` and `COUNT`, `DISTINCT`, ordering and `LIMIT`, still parameterized | 05 | **points (tests only)** |

## About running Postgres

The activity tests run against an **in-memory Postgres** (`pg-mem`), so they pass
in any Codespace with **zero database setup** - just `npm install` and
`npm test`. To run your app *for real* (and to truly understand it), install a
real Postgres or use a free hosted one; see
[02](02-introduction-to-postgresql.md). Your code is the same either way, because
you connect through the `pg` library.

## How the last four are graded

m5a2 and m5a3 are worth **50 points each**; m5a4 and m5a5, the midterm
capstones, are worth **100 points each**; m5a6 is worth **25**, scored by its
tests alone. Every one of them is split between an
**automated** half (your tests pass) and a second half your instructor reviews.
For m5a2, m5a3 and m5a4 that second half is **code quality**: are your queries
parameterized, is not-found handled, are routes and data access cleanly
separated, and in m5a4 is the relationship modeled properly. m5a5 swaps it for a
**design** half, judged from the screenshots its CI publishes. Full details are in
each activity's `RUBRIC.md`. The Module 4 activities and m5a1 remain test-only.
