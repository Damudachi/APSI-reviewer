import { describe, it, expect, beforeEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { newDb } from 'pg-mem'
import {
  allBooksWithAuthors,
  booksByAuthor,
  authorsWithoutBooks,
  bookCountByAuthor,
  onLoanNow,
  loanHistory,
  neverBorrowed,
  mostBorrowed,
  borrowersOfAuthor,
  overdueLoans,
} from './queries.js'

// The library schema. You do not write this: every test starts from a fresh
// in-memory Postgres with these three tables and the rows below already in it.
const SCHEMA = `
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
`

// Fixed data, the same for every test, so you can reason about the expected
// answers by hand.
//
//   authors                books                            loans
//   1 Ambeth Ocampo        1 Rizal in Manila     (a1, 2012)  book 1, Perez,  returned
//   2 Nick Joaquin         2 Bones of the Hero   (a1, 2016)  book 1, Santos, OUT
//   3 Gina Apostol         3 The Woman Who Had   (a2, 1972)  book 2, Santos, OUT
//   4 Jose Dalisay         4 Cave and Shadows    (a2, 1983)  book 3, Cruz,   returned
//                          5 Insurrecto          (a3, 2018)  book 3, Perez,  returned
//                                                            book 4, Reyes,  OUT (old)
// Author 4 has no books at all. Book 5 has never been borrowed.
const SEED = `
  INSERT INTO authors (name, country) VALUES
    ('Ambeth Ocampo', 'Philippines'),
    ('Nick Joaquin', 'Philippines'),
    ('Gina Apostol', 'Philippines'),
    ('Jose Dalisay', 'Philippines');

  INSERT INTO books (title, author_id, year) VALUES
    ('Rizal in Manila', 1, 2012),
    ('Bones of the Hero', 1, 2016),
    ('The Woman Who Had Two Navels', 2, 1972),
    ('Cave and Shadows', 2, 1983),
    ('Insurrecto', 3, 2018);

  INSERT INTO loans (book_id, borrower, loaned_on, returned_on) VALUES
    (1, 'Perez',  '2026-06-01', '2026-06-20'),
    (1, 'Santos', '2026-07-15', NULL),
    (2, 'Santos', '2026-07-20', NULL),
    (3, 'Cruz',   '2026-05-02', '2026-05-30'),
    (3, 'Perez',  '2026-06-11', '2026-06-28'),
    (4, 'Reyes',  '2026-04-04', NULL);
`

let pool
beforeEach(async () => {
  const db = newDb()
  const { Pool } = db.adapters.createPg()
  pool = new Pool()
  await pool.query(SCHEMA)
  await pool.query(SEED)
})

// Small helpers so a driver returning COUNT as a string (real Postgres does)
// is not marked wrong.
const num = (v) => Number(v)
const titles = (rows) => rows.map((r) => r.title)

describe('allBooksWithAuthors', () => {
  it('returns every book with its author name, alphabetically by title', async () => {
    const rows = await allBooksWithAuthors(pool)
    expect(titles(rows)).toEqual([
      'Bones of the Hero',
      'Cave and Shadows',
      'Insurrecto',
      'Rizal in Manila',
      'The Woman Who Had Two Navels',
    ])
  })

  it('names the author of each book in an `author` column', async () => {
    const rows = await allBooksWithAuthors(pool)
    const byTitle = Object.fromEntries(rows.map((r) => [r.title, r.author]))
    expect(byTitle['Insurrecto']).toBe('Gina Apostol')
    expect(byTitle['Cave and Shadows']).toBe('Nick Joaquin')
  })
})

describe('booksByAuthor', () => {
  it('returns only that author\'s books, alphabetically', async () => {
    const rows = await booksByAuthor(pool, 'Ambeth Ocampo')
    expect(titles(rows)).toEqual(['Bones of the Hero', 'Rizal in Manila'])
  })

  it('returns an empty array for an author with no books', async () => {
    expect(await booksByAuthor(pool, 'Jose Dalisay')).toEqual([])
  })

  it('treats the name as data, not as SQL (a quote must not break it)', async () => {
    // This only survives if the name went in as $1. Concatenate it into the
    // query string and the apostrophe ends the literal and the query throws.
    expect(await booksByAuthor(pool, "Flannery O'Connor")).toEqual([])
  })
})

describe('authorsWithoutBooks', () => {
  it('finds the author with no books and nobody else', async () => {
    const rows = await authorsWithoutBooks(pool)
    expect(rows.map((r) => r.name)).toEqual(['Jose Dalisay'])
  })
})

describe('bookCountByAuthor', () => {
  it('counts the books each author wrote', async () => {
    const rows = await bookCountByAuthor(pool)
    const byName = Object.fromEntries(rows.map((r) => [r.name, num(r.books)]))
    expect(byName['Ambeth Ocampo']).toBe(2)
    expect(byName['Gina Apostol']).toBe(1)
  })

  it('includes an author with zero books, as 0', async () => {
    const rows = await bookCountByAuthor(pool)
    const byName = Object.fromEntries(rows.map((r) => [r.name, num(r.books)]))
    expect(byName['Jose Dalisay']).toBe(0)
  })

  it('lists every author exactly once, most books first', async () => {
    const rows = await bookCountByAuthor(pool)
    expect(rows.length).toBe(4)
    const counts = rows.map((r) => num(r.books))
    expect(counts).toEqual([...counts].sort((a, b) => b - a))
  })
})

describe('onLoanNow', () => {
  it('returns only the books that are still out', async () => {
    const rows = await onLoanNow(pool)
    expect(titles(rows).sort()).toEqual([
      'Bones of the Hero',
      'Cave and Shadows',
      'Rizal in Manila',
    ])
  })

  it('says who has each one', async () => {
    const rows = await onLoanNow(pool)
    const byTitle = Object.fromEntries(rows.map((r) => [r.title, r.borrower]))
    expect(byTitle['Cave and Shadows']).toBe('Reyes')
    expect(byTitle['Bones of the Hero']).toBe('Santos')
  })
})

describe('loanHistory', () => {
  it('returns every loan of one book, newest first', async () => {
    const rows = await loanHistory(pool, 3)
    expect(rows.map((r) => r.borrower)).toEqual(['Perez', 'Cruz'])
  })

  it('returns an empty array for a book nobody has borrowed', async () => {
    expect(await loanHistory(pool, 5)).toEqual([])
  })
})

describe('neverBorrowed', () => {
  it('finds the book with no loans at all', async () => {
    const rows = await neverBorrowed(pool)
    expect(titles(rows)).toEqual(['Insurrecto'])
  })
})

describe('mostBorrowed', () => {
  it('ranks books by how often they were borrowed', async () => {
    const rows = await mostBorrowed(pool, 3)
    expect(titles(rows)).toEqual([
      'Rizal in Manila',
      'The Woman Who Had Two Navels',
      'Bones of the Hero',
    ])
    expect(num(rows[0].loans)).toBe(2)
  })

  it('returns at most the number of rows asked for', async () => {
    expect((await mostBorrowed(pool, 2)).length).toBe(2)
    expect((await mostBorrowed(pool, 1)).length).toBe(1)
  })
})

describe('borrowersOfAuthor', () => {
  it('finds everyone who borrowed a book by that author, once each', async () => {
    const rows = await borrowersOfAuthor(pool, 'Ambeth Ocampo')
    expect(rows.map((r) => r.borrower).sort()).toEqual(['Perez', 'Santos'])
  })

  it('returns an empty array for an author nobody borrowed', async () => {
    expect(await borrowersOfAuthor(pool, 'Gina Apostol')).toEqual([])
  })
})

describe('overdueLoans', () => {
  it('returns loans still out that started before the cutoff', async () => {
    const rows = await overdueLoans(pool, '2026-07-01')
    expect(rows.map((r) => r.borrower)).toEqual(['Reyes'])
    expect(rows[0].title).toBe('Cave and Shadows')
  })

  it('ignores loans that were already returned', async () => {
    const rows = await overdueLoans(pool, '2026-12-31')
    expect(rows.map((r) => r.borrower).sort()).toEqual(['Reyes', 'Santos', 'Santos'])
  })
})

describe('Student info (student.json)', () => {
  const path = fileURLToPath(new URL('./student.json', import.meta.url))
  const info = JSON.parse(readFileSync(path, 'utf8'))

  for (const field of ['classCode', 'fullName', 'studentNumber', 'studentEmail', 'personalEmail', 'githubAccount']) {
    it(`${field} is filled in`, () => {
      expect(info[field], `Set ${field} in student.json`).toBeTruthy()
    })
  }
})
