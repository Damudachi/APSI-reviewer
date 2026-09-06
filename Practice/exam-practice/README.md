# APSI Practical Midterm Exam - Practice Activity

## Scenario: Campus Equipment & Reservations API

You are building a backend API for managing school equipment (`items`) and student reservations (`borrowings`).

### Database Schema
1. `items`:
   - `id`: SERIAL PRIMARY KEY
   - `name`: TEXT NOT NULL
   - `category`: TEXT NOT NULL

2. `borrowings`:
   - `id`: SERIAL PRIMARY KEY
   - `item_id`: INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE
   - `student_name`: TEXT NOT NULL
   - `days`: INTEGER NOT NULL
   - `borrowed_at`: TIMESTAMPTZ DEFAULT now()

---

### Your Tasks

#### Task 1: Complete `borrowingsRepo.js` (SQL Data Access)
- Write parameterized SQL queries (`$1, $2, ...`) for all repository functions.
- **CRITICAL REQUIREMENT:** Every READ query in `borrowingsRepo.js` must `JOIN` with `items` and alias `items.name` as `item_name`.

#### Task 2: Complete `app.js` (Express HTTP Layer)
- Implement `validateId` middleware to reject non-numeric `:id` parameters with status `400`.
- Implement `errorHandler` middleware (4 arguments: `err, req, res, next`).
- Implement validation helper functions: `isValidItem` and `isValidBorrowing`.
- Implement Express route handlers:
  - `GET /health` (200 `{ status: 'ok' }`)
  - `GET /items` (200 array)
  - `POST /items` (201 created object, 400 if invalid body)
  - `GET /items/:id/borrowings` (200 array, 404 if item does not exist)
  - `GET /borrowings` (200 array, supports `?minDays=X`, 400 if minDays is NaN)
  - `GET /borrowings/:id` (200 single object, 404 if not found)
  - `POST /borrowings` (201 created object, 400 if invalid body, 400 if item_id does not exist in items)
  - `DELETE /borrowings/:id` (204 no body, 404 if not found)
  - 404 fallback route handler
  - Error handler middleware attached **last**

---

### How to Run Tests
Open your terminal in `Practice/exam-practice` and run:
```bash
npm install
npm test
```
