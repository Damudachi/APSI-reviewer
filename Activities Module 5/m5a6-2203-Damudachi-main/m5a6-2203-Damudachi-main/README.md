# Module 5 - Activity 6 - Joins and reporting queries

[![Made with Claude](https://img.shields.io/badge/Made_with-Claude-D97757?logo=anthropic&logoColor=white)](https://tjakoen.github.io/notes/ten-times-zero)
![Node.js](https://img.shields.io/badge/Node.js-5FA04E?logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)

Ten questions about a small library, each answered by **one SQL query**. No
Express, no routes, no schema to design: the tables are built and filled for
you, and the only thing you write is the SQL.

This is the drill for the last section of Module 5, the one we have only read so
far. A **foreign key** ties a book to its author and a loan to its book, and a
**JOIN** is how you read that relationship back out.

> **Read first:**
> [`m5-databases/05-relations-and-joins.md`](../m5-databases/05-relations-and-joins.md).
> This activity is that document, ten times over.

## 🎓 This activity is graded (25 points)

Scored **entirely by the tests**: 20 checks on your queries, plus the usual six
on `student.json`. There is no code-quality half and no instructor rubric here,
because a query either answers the question or it does not.

## No database to install

The tests run against an **in-memory Postgres** (`pg-mem`), so `npm test` works
with zero setup. `db.js` shows how you would connect to a real database.

## The schema

Three tables. You do not create them; the tests do, before every single test.

```sql
CREATE TABLE authors (
  id      SERIAL PRIMARY KEY,
  name    TEXT NOT NULL,
  country TEXT
);

CREATE TABLE books (
  id        SERIAL PRIMARY KEY,
  title     TEXT NOT NULL,
  author_id INTEGER NOT NULL REFERENCES authors(id),
  year      INTEGER
);

CREATE TABLE loans (
  id          SERIAL PRIMARY KEY,
  book_id     INTEGER NOT NULL REFERENCES books(id),
  borrower    TEXT NOT NULL,
  loaned_on   DATE NOT NULL,
  returned_on DATE
);
```

Two things to notice before you start:

- `books.author_id` and `loans.book_id` are **foreign keys**. A book is not a
  floating fact, it belongs to an author. A loan belongs to a book.
- `loans.returned_on` is **nullable**, and a NULL there is not missing data. It
  means the book is still out. Several of the questions turn on that one column
  being NULL.

The exact rows the tests use are at the top of
[`queries.test.js`](queries.test.js), with a comment map of who wrote what and
who borrowed what. Read it: every expected answer can be worked out by hand from
that table, which is how you check your query is right before you run anything.

## What to do

1. **Fill in `student.json`** (identical across your repos; `classCode` matches
   the repo name).
2. **Write the ten queries** in [`queries.js`](queries.js). Each function is
   already exported and throws until you replace the `throw` with your query.
   Every function takes the `pool` first and returns `result.rows`.

The ten, in the order they appear:

| Function | The question it answers |
| --- | --- |
| `allBooksWithAuthors` | Every book, with its author's name |
| `booksByAuthor` | The books by one named author |
| `authorsWithoutBooks` | Which authors have no books at all |
| `bookCountByAuthor` | How many books each author wrote, including the zero |
| `onLoanNow` | Which books are out right now, and with whom |
| `loanHistory` | Every loan of one book, newest first |
| `neverBorrowed` | Which books nobody has ever borrowed |
| `mostBorrowed` | The top N books by number of loans |
| `borrowersOfAuthor` | Everyone who borrowed anything by one author, once each |
| `overdueLoans` | Still out, and taken out before a cutoff date |

Two rules the tests enforce:

> ⚠️ **One query per function.** If you are filtering rows in JavaScript
> afterwards, the SQL is doing too little. Three of these are only answerable
> with a `LEFT JOIN`, and reaching for `.filter()` instead is exactly the habit
> this activity exists to break.

> ⚠️ **Every argument goes in as `$1, $2, ...` with a values array.** One test
> passes an author name containing an apostrophe. A query built by joining
> strings together will throw on it, which is the cheap version of the SQL
> injection bug you are being taught to avoid.

**Each query is graded separately.** Eight finished queries score eight finished
queries, so never delete a function you have not written yet: leave the `throw`
in place and the other nine still run.

## Set up your repo

1. **Use this template -> Create a new repository.**
2. **Owner = the `HAU-6APSI` course org.**
3. **Name it** `m5a6-<classcode>-yourname`.
4. **Make it Private.**

```bash
git clone https://github.com/HAU-6APSI/m5a6-<classcode>-yourname.git
cd m5a6-<classcode>-yourname
```

## Running the tests

```bash
npm install
npm test
```

Vitest names each failing check after the question it was asking, so a red line
tells you which of the ten to go back to.

## Confirm your submission

**Pushing your work is how you submit it.**

```bash
git add -A
git commit -m "Module 5 Activity 6 complete"
git push
```

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
