# Rubric - m5a4 Relational REST API (midterm capstone)

This capstone is worth **100 points**, split into an automated half and a
code-quality half. Both halves are shown so this is the complete grading
reference (60 automated + 40 code quality = 100).

## Automated checks (60 pts, scored from the tests - not by hand)

The automated 60 is proportional to the share of the suite that passes. The suite
is 34 tests, so each test is worth about 1.76 points. Here is what it covers:

| Check | Tests |
| --- | --- |
| The schema: both tables, the foreign key rejects an orphan sighting, email is unique | 3 |
| The data layer: `create` returns the row, `getById` joins `investigator_name`, `getAll` filters on `minSpookiness`, `getByInvestigator` scopes to one reporter | 4 |
| `GET /health` returns 200 and `{ status: "ok" }` | 1 |
| `GET /investigators` returns every investigator | 1 |
| `POST /investigators` (201 created / 400 invalid / 409 duplicate email) | 3 |
| `GET /investigators/:id/sightings` (200 with only that reporter's sightings / 404 missing) | 2 |
| `GET /sightings` (list carries `investigator_name` / `?minSpookiness=` filters) | 2 |
| `GET /sightings/:id` (200 with `investigator_name` / 404 missing) | 2 |
| `POST /sightings` (201 persisted / 400 invalid / 400 unknown `investigator_id`) | 3 |
| `PATCH /sightings/:id` (200 updated / 404 missing) | 2 |
| `DELETE /sightings/:id` (204 / 404 missing) | 2 |
| Middleware (non-numeric id 400 / malformed JSON body 400 as JSON / unknown route 404) | 3 |
| `student.json` is filled in (one test per field) | 6 |
| **Automated subtotal** | **34 tests = 60 pts** |

## Code-quality rubric (40 pts, scored by the instructor from the source)

The AI proposes a score for ONLY this table; the automated half is scored
deterministically from the tests.

| Criterion | Max | Excellent (full marks) | Satisfactory (~60-80%) | Needs work (~0-40%) |
| --- | --- | --- | --- | --- |
| Relational modeling and JOINs | 10 | two tables with the foreign key declared in the schema and a deliberate `ON DELETE` rule; reads use one reusable JOIN with clear aliases; no reporter data duplicated onto sightings | relationship works but the JOIN is copy-pasted per function, or the `ON DELETE` behaviour looks accidental | no real foreign key (link kept by convention only), reporter fields duplicated into sightings, or the name fetched with a second query per row |
| Layering (routes vs data access) | 10 | routes only do HTTP and call the repos; no SQL anywhere in `app.js`; no `req`/`res` anywhere in a repo | mostly layered, minor leak | SQL written inline in routes, or route logic duplicated inside the repos |
| REST correctness | 8 | correct verb, URL and status code throughout (201 create, 204 delete, 404 missing, 400 bad input, 409 duplicate); the nested route reads as a path through the data | one or two off (for example 200 instead of 201, or 400 where 409 belongs) | wrong verbs/URLs, or 200 for everything |
| Middleware and error handling | 6 | the id check and the error handler are real middleware, registered in the right order, reused rather than repeated per route; a missing parent is a deliberate 400/404, never an escaped database error | present but partly duplicated inside handlers | checks copy-pasted into every route, no error middleware, or database errors reaching the client as 500s |
| Query safety and code clarity | 6 | every query parameterized, including the filter that comes from the URL; `async`/`await` used correctly; readable routes, no dead code | minor issues | a value from `req.query` or `req.params` concatenated into SQL, or messy, hard-to-follow code |

Code-quality total: 40 points.

Notes for feedback: name the concept to revisit or ask a guiding question; never
hand over corrected code. Focus on the relational modeling (is the foreign key
real and is the JOIN doing the work?) and on the clean separation between the
HTTP layer and the data layer.
