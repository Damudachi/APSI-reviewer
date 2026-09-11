# Music Stream Plays API - Harder Midterm Practice Exam

Welcome to your custom practice activity! This exercise matches **100% of the structure, file layout, ES module syntax, and question formats** of your professor's reviewer (`reviewer-classcode-yourname-main`), but features a **brand new schema (Music Stream Plays)** and **harder bug variations**.

---

## 🎯 Goal
Find and fix all **5 Bugs** and **2 TODOs** in `app.js` and `public/app.js`.

---

## 🚀 How to Run

1. Open your terminal in this directory:
   ```bash
   cd "d:\Download2\APSI reviewer\Practice\harder-exam-practice"
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. Open `http://localhost:3000` in your browser.
4. Run the report anytime to print your Canvas quiz values:
   ```bash
   npm run report
   # or
   npm run exam
   ```

---

## 📋 The Bugs & TODOs Checklist

- [ ] **BUG A (`app.js`)**: `Most played genre` panel is showing the LEAST played genre. Check `ORDER BY` direction.
- [ ] **BUG B (`app.js`)**: `Long plays (>180s)` count is incorrect. Check the inequality operator (`<` vs `>`).
- [ ] **BUG C (`app.js`)**: `Busiest artist` panel query is grouping by `a.genre` instead of `a.name`.
- [ ] **BUG D (`app.js`)**: `GET /api/plays/search?genre=...` reads `req.query.genre_type` instead of `req.query.genre`.
- [ ] **BUG E (`public/app.js`)**: The "Duration (s)" table column shows `undefined`. Fix the property name on `s`.
- [ ] **TODO 1 (`app.js`)**: Add `GET /api/plays/:id` route. Return matching play or `404` status with `{ error: 'Play not found' }`.
- [ ] **TODO 2 (`app.js`)**: Add `POST /api/plays` route. Insert new play into database with `RETURNING *` and respond with status `201`.
