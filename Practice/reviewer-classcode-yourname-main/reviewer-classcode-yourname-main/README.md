# Midterm Reviewer - Library Loans

This is a **reviewer**: a practice run for the midterm practical, in the same
shape but with different data. You are given a mostly-working app - a Node/Express
API over a PostgreSQL database with a small **dashboard** web page - that has a
few **bugs** and two **TODOs**. Fix them so every panel shows the correct value.
The moves are exactly the ones the real exam asks for; the numbers are different
on purpose, so practise the fixing, not the answers.

This reviewer is **not the exam and is not closed-book.** Use your notes, the
Module 4 and 5 pages, and take your time. It is just practice, so there is nothing
to submit and no grade attached - fixing it is the whole point.

## Setup and run

You do not need to install PostgreSQL - the database runs in memory (200 loans,
the same every run).

```bash
npm install
npm start        # then open http://localhost:3000 for the dashboard
```

Prefer the terminal? `npm run report` prints the same dashboard values as text.

## What to fix

Five bugs, marked in the code with `BUG A` ... `BUG E`, plus two `TODO`s:

- **app.js (Module 4 + 5):**
  - BUG A - "most borrowed genre" is showing the least borrowed one.
  - BUG B - "long loans" should be loans out for **more than 14 days**.
  - BUG C - "busiest author" should group by **author**, not by book title.
  - BUG D - the genre filter reads the wrong query-string field.
  - **TODO 1** - there is **no route** to look up one loan by id. Add
    `GET /api/loans/:id` (return the row, or a 404 if there is none).
  - **TODO 2** - finish `POST /api/loans` so it inserts the row and returns the
    created record.
- **public/app.js (the dashboard):**
  - BUG E - the "All loans" table shows `undefined` in one column because it
    reads a field name that does not exist on the row.

## The ten practice questions

Once the app is fixed, read these off the dashboard (or `npm run report`):

1. Total loans.
2. Most borrowed genre.
3. Long loans - how many are out more than 14 days.
4. Busiest author.
5. How many loans are for books in the "mystery" genre (use the filter).
6. Before you fix it, what does the "Days out" column show for every row?
7. Look up loan id 42 - its member.
8. Look up loan id 42 - its days out.
9. Look up an id that does not exist - the HTTP status it returns.
10. Add a loan with the form - the HTTP status a successful add returns.

## No laptop? Fix it in the browser

You do not have to run anything locally. Edit the files right on github.com (open
a file, click the pencil, commit), and every push runs your app for you on
GitHub. Open the run under the **Actions** tab and its **summary** shows two
things: a self-check of whether each bug and TODO is fixed, and **your current
answers to the ten practice questions**. It also saves a screenshot of your
dashboard as the **dashboard-screenshot** artifact.

The green check is **not a grade** - it just tells you how far you have got. When
it passes, you are ready for the real thing.

## The data

Two tables: **books** (8 titles by a handful of authors, in a few genres) and
**loans** (200 rows, each linked to a book). Do not edit `db.js`. Good luck.
