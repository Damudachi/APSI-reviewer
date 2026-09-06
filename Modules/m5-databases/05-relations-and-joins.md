# 05 - Relations, foreign keys and JOINs

## The one-sentence answer

**A relational database earns its name by letting one table point at another: a
foreign key stores the link, the database enforces it, and a `JOIN` reads both
tables back as one answer.** This is what you implement in m5a4, where sightings
stop floating on their own and start belonging to an investigator.

## Why one table stops being enough

The app so far stores a sighting like this:

```
sightings
 id | place             | description | spookiness
  1 | Library 3rd floor | cold spot   | 2
```

Now the requirement changes: every sighting was reported by somebody, and we want
to know who. The tempting move is to bolt the reporter onto the same table:

```
 id | place             | reporter_name | reporter_email
  1 | Library 3rd floor | Ada Reyes     | ada@hau.edu
  2 | Old gym           | Ada Reyes     | ada@hau.edu
```

That is the wrong answer, for reasons worth naming:

- **Duplication.** Ada's details are copied into every row she reports.
- **Update anomalies.** Ada changes her email and you have to find and fix every
  row. Miss one and the database now disagrees with itself.
- **No independent existence.** An investigator who has not reported anything yet
  cannot be stored at all.

The fix is to give each real-world thing its own table, and store the
**relationship** between them.

## One-to-many

```
investigators                       sightings
 id | name      | email              id | investigator_id | place
  1 | Ada Reyes | ada@hau.edu         1 |               1 | Library 3rd floor
  2 | Boris Cruz| boris@hau.edu       2 |               1 | Old gym
                                      3 |               2 | Chapel
```

**One** investigator has **many** sightings; each sighting belongs to exactly one
investigator. That is a **one-to-many** relationship, the most common kind you
will meet. The link lives on the **many** side: the child row stores the parent's
id, never the other way around.

The column that stores it (`investigator_id`) is the **foreign key**. It points
at the **primary key** of the other table.

## Declaring the relationship in SQL

```sql
CREATE TABLE investigators (
  id    SERIAL PRIMARY KEY,
  name  TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
);

CREATE TABLE sightings (
  id              SERIAL PRIMARY KEY,
  investigator_id INTEGER NOT NULL REFERENCES investigators(id) ON DELETE CASCADE,
  place           TEXT NOT NULL,
  description     TEXT,
  spookiness      INTEGER NOT NULL
);
```

Read that middle line carefully, it is the whole idea:

- **`REFERENCES investigators(id)`** declares the foreign key. The database now
  guarantees **referential integrity**: an `INSERT` naming an investigator who
  does not exist is rejected, not stored. Your app cannot create an orphan even by
  accident.
- **`NOT NULL`** means a sighting must have a reporter.
- **`ON DELETE CASCADE`** answers the question "what happens to Ada's sightings if
  Ada is deleted?" - they go with her. The alternatives are `ON DELETE RESTRICT`
  (refuse to delete a parent that still has children) and `SET NULL` (keep the
  child, forget the link). Choosing one is a design decision, so choose it on
  purpose.
- **`UNIQUE`** on email is a second constraint worth noticing: it makes "two
  investigators with the same email" impossible at the database level, not merely
  discouraged in your route.

**Order matters.** `investigators` has to exist before a table can reference it.

## Reading it back: JOIN

A sighting row on its own only holds `investigator_id`, a number. Nobody calling
your API wants a number. A **JOIN** reads matching rows from both tables in one
query:

```sql
SELECT s.*, i.name AS investigator_name
FROM sightings s
JOIN investigators i ON i.id = s.investigator_id
ORDER BY s.id;
```

Piece by piece:

- **`FROM sightings s`** - `s` is a **table alias**, so you can write `s.place`
  instead of the full table name.
- **`JOIN investigators i ON i.id = s.investigator_id`** - the `ON` clause is the
  matching rule: pair each sighting with the investigator whose id it stores.
- **`i.name AS investigator_name`** - a **column alias**. Both tables have a
  column that could be called `name`, so you say plainly what this one is. Your
  API contract is the alias, so spell it exactly the same way every time.

The result is one flat row per sighting, reporter's name included:

```
 id | place             | spookiness | investigator_name
  1 | Library 3rd floor |          2 | Ada Reyes
```

### INNER JOIN and LEFT JOIN

A plain `JOIN` is an **INNER JOIN**: it returns only rows that have a match on
both sides. A **`LEFT JOIN`** keeps every row from the left table even when the
right side has none, filling the missing columns with `NULL`.

Which one you want follows from the schema. Because `investigator_id` is
`NOT NULL`, every sighting is guaranteed a match, so an inner `JOIN` is right
here. If you were listing investigators with their sightings, an investigator who
has reported nothing would need a `LEFT JOIN` to appear at all.

## Filtering, still parameterized

The rule from doc 03 does not relax because a query got bigger:

```js
const result = await pool.query(
  `SELECT s.*, i.name AS investigator_name
   FROM sightings s
   JOIN investigators i ON i.id = s.investigator_id
   WHERE s.spookiness >= $1
   ORDER BY s.id`,
  [minSpookiness]
)
```

The filter **value** travels as `$1`. Never paste a value from `req.query`
straight into the SQL string; that is exactly the SQL injection hole doc 03
warned about, and a filter coming from the URL is the likeliest place to open it.

## What relationships look like over HTTP

Two REST patterns come out of a one-to-many relationship.

**Nested resources** - "the sightings that belong to investigator 1":

```
GET /investigators/1/sightings
```

Read the URL as a path through the data: a collection, one member of it, then a
collection that belongs to that member. If the parent does not exist, the honest
answer is **404** - and you only know that by asking the database first.

**Filtering with a query parameter** - "the scary ones":

```
GET /sightings?minSpookiness=4
```

The rule of thumb: the **path** identifies what you are asking for, the **query
string** narrows it. Filtering, sorting and pagination belong in the query
string; they are not different resources. Two more things to remember: everything
in `req.query` arrives as a **string**, so convert and validate before use, and a
filter that is absent means "no filter", not "filter by nothing".

## Where the validation belongs

You now have two places that can reject a sighting pointing at a missing
investigator: your route, and the foreign key. You want both, for different
reasons.

- The **foreign key** is the guarantee. It is the last line of defence and it
  never sleeps, including against bugs in your own code.
- The **route** is the good manners. Checking first lets you answer **400** with
  a message that says which field was wrong, instead of letting a database error
  escape as a 500.

Defence in depth: validate in the route, constrain in the schema.

## In one breath, for the exam

> A **relational** database links tables with a **foreign key**: the child row
> stores the parent's **primary key** (`investigator_id INTEGER REFERENCES
> investigators(id)`), which gives you **referential integrity** and a choice of
> **`ON DELETE CASCADE`/`RESTRICT`/`SET NULL`**. Reading them back together is a
> **`JOIN ... ON`**, with **table and column aliases** (`i.name AS
> investigator_name`); **INNER** keeps only matches, **LEFT** keeps unmatched rows
> from the left. Filters stay **parameterized**. Over HTTP the relationship shows
> up as a **nested resource** (`/investigators/:id/sightings`, 404 if the parent is
> missing) and as **query-string filtering** (`?minSpookiness=4`), and you both
> validate in the route (400) and constrain in the schema.

## References

- PostgreSQL Documentation. *Data Definition - Constraints* (foreign keys, `ON DELETE`). https://www.postgresql.org/docs/current/ddl-constraints.html
- PostgreSQL Documentation. *Queries - Table Expressions* (joins and aliases). https://www.postgresql.org/docs/current/queries-table-expressions.html
- PostgreSQL Documentation. *SELECT*. https://www.postgresql.org/docs/current/sql-select.html
- node-postgres Documentation. *Queries* (parameterized queries). https://node-postgres.com/features/queries
- Fielding, R. T. *Architectural Styles and the Design of Network-based Software Architectures*, Chapter 5 (REST resources). https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm
- MDN Web Docs. *HTTP response status codes* (400, 404, 409). https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
