# 02 - Introduction to PostgreSQL

## The one-sentence answer

**PostgreSQL ("Postgres") is a free, open-source, and very capable relational
database.** It is the SQL database professionals reach for by default, and the
one you will connect your Node app to.

## What Postgres is

Postgres is a **relational database management system (RDBMS)** - the actual
program that stores your tables on disk, enforces your schema, runs your SQL, and
lets many clients connect at once. It is:

- **open-source and free** - no license cost, run it anywhere;
- **standards-compliant and mature** - decades old, rock-solid, used by huge
  companies;
- **feature-rich** - real types (including `JSON`, arrays, dates), constraints,
  transactions, and more than you will need in this course.

You will hear it compared to **MySQL** (another popular open-source SQL database)
and **SQLite** (a tiny file-based one). They are all relational and speak SQL;
Postgres is the well-rounded default for web APIs.

## Client and server

Postgres runs as a **server** (a background process, listening on port **5432**
by default). Your programs are **clients** that connect to it:

```mermaid
flowchart LR
    psql["psql (terminal client)"] --> PG["PostgreSQL server<br/>(port 5432)"]
    Node["Your Node app (pg)"] --> PG
    PG --> Disk["your data on disk"]
```

A **database server** can hold many named **databases**; each database holds your
tables. You connect to a specific one (for us, say `haunted`).

## Installing and running it

You have three easy options - pick one:

1. **Local install.** macOS: `brew install postgresql@16` then
   `brew services start postgresql@16`. Windows: the EDB installer. Linux:
   `apt install postgresql`.
2. **Docker** (clean and disposable):
   `docker run -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16`
3. **A hosted free tier** (Neon, Supabase, Railway) - a Postgres in the cloud,
   handy from a Codespace.

Once it is running, create a database:

```bash
createdb haunted          # make a database called "haunted"
psql haunted              # open the interactive SQL shell against it
```

> **For grading, you do not need any of this installed.** The activity tests run
> against an **in-memory Postgres** (`pg-mem`) so they work in any Codespace with
> zero setup. Install a real Postgres to *feel* it and to run your app for real -
> which is the point of learning it - but the autograder never requires it.

## psql: the built-in client

`psql` is Postgres's interactive terminal. A few commands to know:

```
psql haunted            # connect to the "haunted" database
\dt                     # list tables
\d sightings            # describe the sightings table
SELECT * FROM sightings;    -- run any SQL; end statements with ;
\q                      # quit
```

Backslash commands (`\dt`, `\q`) are psql shortcuts; everything else is plain SQL.

## Connection details (what your app will need)

To connect, a client needs: **host** (e.g. `localhost`), **port** (`5432`),
**user**, **password**, and **database name**. These are often bundled into one
**connection string**:

```
postgresql://user:password@localhost:5432/haunted
```

You will feed that to node-postgres in the next doc. **Never hard-code passwords
in your source** - they go in an environment variable (`.env`), which the next
doc covers.

## In one breath, for the exam

> **PostgreSQL** is a free, open-source **relational database (RDBMS)** that runs
> as a **server** (default port **5432**) holding one or more **databases** of
> tables. Clients like **`psql`** and your Node app connect to it, typically via
> a **connection string** (`postgresql://user:pass@host:5432/db`). It is the
> mature, standards-compliant default for web APIs.

## References

- PostgreSQL Documentation. *What is PostgreSQL?* https://www.postgresql.org/docs/current/intro-whatis.html
- PostgreSQL Documentation. *Getting Started / Creating a Database*. https://www.postgresql.org/docs/current/tutorial-createdb.html
- PostgreSQL Documentation. *psql reference*. https://www.postgresql.org/docs/current/app-psql.html
- PostgreSQL wiki. *Detailed installation guides*. https://wiki.postgresql.org/wiki/Detailed_installation_guides
- Neon. *Getting started with Postgres* (hosted free tier). https://neon.tech/docs/get-started-with-neon/signing-up
