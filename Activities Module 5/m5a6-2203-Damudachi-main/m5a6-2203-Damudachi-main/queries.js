// Module 5 - Activity 6 - Joins and reporting queries
//
// Ten questions about a small library, each answered by ONE SQL query. The
// tables are already built and filled for you (the schema is in README.md, and
// the exact rows are at the top of queries.test.js); your job is only to ask
// the right question in SQL.
//
// Two rules the tests enforce:
//
//   1. One query per function. No fetching everything and filtering in
//      JavaScript. If you are writing .filter() or .map() over rows to get the
//      answer, the SQL is doing too little.
//   2. Every value that arrives as an argument goes into the query as a
//      PARAMETER ($1, $2, ...) with a values array. Never build SQL by joining
//      strings together. One test passes a name containing an apostrophe, and a
//      concatenated query throws on it.
//
// Each function takes the `pool` first and returns `result.rows` (an array,
// possibly empty) with the exact column names named below. Column names are
// part of the contract: the tests read `row.title`, `row.author`, `row.books`,
// `row.loans`, `row.borrower`, `row.name`.
//
// Concepts to look up if any of these are new: INNER JOIN, LEFT JOIN, IS NULL,
// GROUP BY, COUNT, DISTINCT, ORDER BY, LIMIT. All of them are in
// content/m5-databases/05-relations-and-joins.md.
//
// Each function below throws until you write it. Replace the throw with your
// query. They are graded one at a time, so eight finished queries score eight
// finished queries: never delete one to make the file run.

// Every book, with the name of the author who wrote it.
// Columns: title, author. Ordered by title, A to Z.
export async function allBooksWithAuthors(pool) {
  const result = await pool.query(`
    SELECT books.title, authors.name AS author
    FROM books
    JOIN authors ON books.author_id = authors.id
    ORDER BY books.title ASC;
  `);
  return result.rows;
}

// Only the books written by the author with that exact name.
// Columns: title. Ordered by title, A to Z. Empty array if there are none.
export async function booksByAuthor(pool, authorName) {
  const result = await pool.query(`
    SELECT books.title
    FROM books
    JOIN authors ON books.author_id = authors.id
    WHERE authors.name = $1
    ORDER BY books.title ASC;
  `, [authorName]);
  return result.rows;
}

// The authors who have no books in the library at all. This is the one an
// INNER JOIN can never answer: think about a LEFT JOIN, and what the right-hand
// side of one looks like when there is no match.
// Columns: name. Ordered by name.
export async function authorsWithoutBooks(pool) {
  const result = await pool.query(`
    SELECT authors.name
    FROM authors
    LEFT JOIN books ON authors.id = books.author_id
    WHERE books.id IS NULL
    ORDER BY authors.name ASC;
  `);
  return result.rows;
}

// How many books each author wrote. EVERY author appears, including the one who
// wrote none, whose count is 0 rather than a missing row.
// Columns: name, books. Ordered by books (highest first), then name A to Z.
export async function bookCountByAuthor(pool) {
  const result = await pool.query(`
    SELECT authors.name, COUNT(books.id) AS books
    FROM authors
    LEFT JOIN books ON authors.id = books.author_id
    GROUP BY authors.id, authors.name
    ORDER BY books DESC, authors.name ASC;
  `);
  return result.rows;
}

// The books that are out right now, and who has them. A loan is still out when
// its returned_on is NULL.
// Columns: title, borrower.
export async function onLoanNow(pool) {
  const result = await pool.query(`
    SELECT books.title, loans.borrower
    FROM books
    JOIN loans ON loans.book_id = books.id
    WHERE loans.returned_on IS NULL;
  `);
  return result.rows;
}

// Every loan of one book, past and present.
// Columns: borrower, loaned_on, returned_on. Newest loan first (by loaned_on).
export async function loanHistory(pool, bookId) {
  const result = await pool.query(`
    SELECT borrower, loaned_on, returned_on
    FROM loans
    WHERE book_id = $1
    ORDER BY loaned_on DESC;
  `, [bookId]);
  return result.rows;
}

// The books nobody has ever borrowed.
// Columns: title. Ordered by title.
export async function neverBorrowed(pool) {
  const result = await pool.query(`
    SELECT books.title
    FROM books
    LEFT JOIN loans ON loans.book_id = books.id
    WHERE loans.id IS NULL
    ORDER BY books.title ASC;
  `);
  return result.rows;
}

// The most-borrowed books, counting every loan ever made. Books that were never
// borrowed do not appear at all. `limit` is how many rows to return, and it goes
// in as a parameter like any other value.
// Columns: title, loans. Ordered by loans (highest first), then title A to Z.
export async function mostBorrowed(pool, limit) {
  const result = await pool.query(`
    SELECT books.title, COUNT(loans.id) AS loans
    FROM loans
    JOIN books ON books.id = loans.book_id
    GROUP BY books.id, books.title
    ORDER BY loans DESC, books.title ASC
    LIMIT $1;
  `, [limit]);
  return result.rows;
}

// Everyone who has ever borrowed a book by that author. Somebody who borrowed
// two of that author's books appears ONCE. This one needs all three tables.
// Columns: borrower. Ordered by borrower.
export async function borrowersOfAuthor(pool, authorName) {
  const result = await pool.query(`
    SELECT DISTINCT loans.borrower
    FROM authors
    JOIN books ON authors.id = books.author_id
    JOIN loans ON books.id = loans.book_id
    WHERE authors.name = $1
    ORDER BY loans.borrower ASC;
  `, [authorName]);
  return result.rows;
}

// Loans that are still out (never returned) and were taken out before the
// cutoff date. `cutoff` is a date string like '2026-07-01' and goes in as a
// parameter.
// Columns: title, borrower, loaned_on. Oldest loan first.
export async function overdueLoans(pool, cutoff) {
  const result = await pool.query(`
    SELECT books.title, loans.borrower, loans.loaned_on
    FROM loans
    JOIN books ON books.id = loans.book_id
    WHERE loans.loaned_on < $1 AND loans.returned_on IS NULL
    ORDER BY loans.loaned_on ASC;
  `, [cutoff]);
  return result.rows;
}