# Rubric - m5a2 PostgreSQL CRUD (the data-access layer)

This activity is worth **50 points**, split into an automated half and a
code-quality half. Both halves are shown so this is the complete grading
reference (35 automated + 15 code quality = 50).

## Automated checks (35 pts, scored from the tests - not by hand)

The automated 35 is proportional to the share of the suite that passes. The suite
is 15 tests, so each test is worth about 2.3 points. Here is what it covers:

| Check | Tests |
| --- | --- |
| `create` inserts and returns the row (RETURNING) | 1 |
| `getAll` returns all rows (and `[]` when empty) | 2 |
| `getById` returns the row, or `null` when missing | 2 |
| `update` updates and returns the row, or `null` when missing | 2 |
| `remove` deletes and returns `true`, or `false` when missing | 2 |
| `student.json` is filled in (one test per field) | 6 |
| **Automated subtotal** | **15 tests = 35 pts** |

`createSchema` has no test of its own: every check above runs against the table it
creates, so if `createSchema` is broken the whole suite fails.

## Code-quality rubric (15 pts, scored by the instructor from the source)

The AI proposes a score for ONLY this table; the automated half is scored
deterministically from the tests.

| Criterion | Max | Excellent (full marks) | Satisfactory (~60-80%) | Needs work (~0-40%) |
| --- | --- | --- | --- | --- |
| Parameterized queries / no SQL injection | 6 | every value passed as `$1, $2, ...` with a values array; no string concatenation of user input anywhere | mostly parameterized, one lapse | builds SQL by concatenating values |
| Not-found handling | 3 | `getById`/`update` return `null` and `remove` returns `false` cleanly for a missing id | handled but awkwardly | crashes or returns the wrong shape on a missing id |
| Clean data-access separation | 3 | one focused function per operation; no HTTP/`req`/`res`, no `console.log`, single responsibility | mostly clean | mixes concerns or duplicates logic |
| SQL correctness & idiom | 3 | correct use of `RETURNING`, `WHERE id = $n`, `ORDER BY`; no needless extra queries | minor redundancy | missing `WHERE`, N+1 queries, or wrong SQL |

Code-quality total: 15 points.

Notes for feedback: name the concept to revisit or ask a guiding question; never
hand over corrected code. Focus on query safety (parameterization), correctness,
and clean separation of the data layer.
