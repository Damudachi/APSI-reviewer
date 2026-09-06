# 01 - Relational databases and SQL

## The one-sentence answer

**A relational database stores data in tables - rows and columns - and SQL is the
language you use to ask it questions and change it.** It is where your app's data
lives *permanently*, surviving restarts, unlike the in-memory array from m4a3.

## Why a database at all

In m4a3 your sightings lived in a JavaScript array. That array vanishes the
moment the server restarts - all data lost. A **database** solves this: it stores
data **on disk**, safely, and lets many users read and write it at once without
corrupting it. That property - data that outlives the program - is called
**persistence**, and it is the whole reason Module 5 exists.

## The relational model: tables

A **relational database** organizes data into **tables**. A table is a grid:

- a **column** is a named field with a type (`place` is text, `spookiness` is a
  number)
- a **row** (or **record**) is one entry - one sighting

`sightings` table:

| id | place | description | spookiness | reported_at |
| --- | --- | --- | --- | --- |
| 1 | Library 3rd floor | cold spot near the stacks | 4 | 2026-07-01 |
| 2 | Old gym | footsteps, nobody there | 5 | 2026-07-03 |

- A **primary key** uniquely identifies each row - here `id`. No two rows share
  one, and databases can auto-generate it for you.
- A **schema** is the shape of your tables: what columns exist and their types.
  You define it once with `CREATE TABLE`.

"Relational" refers to how tables can **relate** to one another: a `comments`
table could reference a sighting by its `id` (a **foreign key**). You will keep
to a single table in this module, but that is the idea the name points at.

## SQL: the language

**SQL** (Structured Query Language) is how you talk to a relational database. Four
statements cover everyday CRUD - and they line up exactly with the REST verbs you
already know:

```sql
-- CREATE (maps to POST)
INSERT INTO sightings (place, description, spookiness)
VALUES ('Library 3rd floor', 'cold spot', 4);

-- READ (maps to GET)
SELECT * FROM sightings;                 -- all rows
SELECT * FROM sightings WHERE id = 1;    -- one row

-- UPDATE (maps to PUT/PATCH)
UPDATE sightings SET spookiness = 5 WHERE id = 1;

-- DELETE (maps to DELETE)
DELETE FROM sightings WHERE id = 1;
```

| SQL | CRUD | REST verb |
| --- | --- | --- |
| `INSERT` | Create | POST |
| `SELECT` | Read | GET |
| `UPDATE` | Update | PUT/PATCH |
| `DELETE` | Delete | DELETE |

### The pieces to recognize

- **`WHERE`** filters which rows a statement touches. Forget it on an `UPDATE` or
  `DELETE` and you change **every** row - a classic, painful mistake.
- **Columns list + `VALUES`** on `INSERT` say which fields you are setting.
- **`SELECT *`** means "all columns"; you can also name them: `SELECT id, place`.

## Relational (SQL) vs the other kind (NoSQL), in one line

You may hear about **NoSQL** databases (MongoDB and friends) that store flexible
documents instead of rigid tables. Relational databases trade some flexibility
for **structure, strong consistency, and powerful queries** - a great fit when
your data has a clear shape, like our sightings. PostgreSQL, next, is relational.

## In one breath, for the exam

> A **relational database** stores data in **tables** (rows and columns) with a
> **primary key** per row and a **schema** defining column types, giving you
> **persistence**. **SQL** manipulates it: **INSERT** (create), **SELECT** (read),
> **UPDATE** (update), **DELETE** (delete) - the same CRUD as REST. **`WHERE`**
> picks which rows are affected; omitting it on UPDATE/DELETE hits every row.

## References

- PostgreSQL Documentation. *The SQL Language - a brief tutorial*. https://www.postgresql.org/docs/current/tutorial-sql.html
- MDN Web Docs. *Database and SQL basics* (glossary). https://developer.mozilla.org/en-US/docs/Glossary/Database
- Khan Academy. *Intro to SQL: Querying and managing data*. https://www.khanacademy.org/computing/computer-programming/sql
- W3Schools. *SQL Tutorial* (syntax reference). https://www.w3schools.com/sql/
