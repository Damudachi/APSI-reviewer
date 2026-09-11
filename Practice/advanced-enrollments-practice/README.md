# Course Enrollments & Grades - Advanced Practice Exam

Welcome to your **Advanced Practice Exam**! This activity features a **Course Enrollments & Grades** database, **4 brand new types of bugs**, and **4 TODOs** (GET, POST with validation, PATCH, and DELETE).

---

## 🎯 Goal
Solve all **4 Bugs** and **4 TODOs** in `app.js` and `public/app.js`.

---

## 🚀 How to Run

1. Open your terminal:
   ```bash
   cd "d:\Download2\APSI reviewer\Practice\advanced-enrollments-practice"
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. Check your quiz scores anytime with:
   ```bash
   npm run exam
   ```

---

## 📋 The Bugs & TODOs Checklist

- [ ] **BUG A (`app.js`)**: "Average Grade" panel is showing the total sum of all grades instead of the average grade.
- [ ] **BUG B (`app.js`)**: "Ungraded Count" panel shows `0`, but there are students with missing/NULL grades.
- [ ] **BUG C (`app.js`)**: "Top Instructor" panel is grouping by course ID instead of instructor name.
- [ ] **BUG D (`app.js`)**: `GET /api/enrollments/search?dept=...` fails to filter by department.
- [ ] **BUG E (`public/app.js`)**: Dashboard table shows `undefined` under the Student Name column.
- [ ] **TODO 1 (`app.js`)**: `GET /api/enrollments/:id` - Return single enrollment or 404 `{ error: 'Enrollment not found' }`.
- [ ] **TODO 2 (`app.js`)**: `POST /api/enrollments` - Insert new enrollment from `req.body`. Add validation: if `student_name` or `course_id` is missing, return status `400` with `{ error: 'Missing required fields' }`. Otherwise insert row and respond with status `201`.
- [ ] **TODO 3 (`app.js`)**: `PATCH /api/enrollments/:id/grade` - Update `grade_score` from `req.body.grade_score`. Return updated row or status `404` if not found.
- [ ] **TODO 4 (`app.js`)**: `DELETE /api/enrollments/:id` - Delete enrollment by id. If found, return status `200` with `{ message: 'Enrollment deleted', deleted: <row> }`. If not found, return status `404`.
