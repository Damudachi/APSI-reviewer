# 🏆 Final Boss Midterm Practice Reviewer

Welcome to the **Final Boss Practice Reviewer**! This challenge combines everything from Module 4 (Node, Express, Routing, Status Codes) and Module 5 (PostgreSQL schema, JOINs, Group By, Parameterized Queries, Repository Layer).

It follows the exact structure of your midterm exam tomorrow, but with slightly tougher challenges to make sure you get 100%!

---

## 🎯 What to Fix

### 📁 `app.js`:
- **BUG A:** "Highest spookiness place" panel is showing the place with the lowest average.
- **BUG B:** "Busiest investigator" panel counts sightings but groups by the place name instead of the investigator.
- **BUG C:** "High spookiness count" panel should count sightings with spookiness **MORE THAN 4** (`> 4`).
- **BUG D:** Search route `GET /api/sightings/search` reads `req.query.p` instead of `req.query.place`.
- **TODO 1:** Add route `GET /api/sightings/:id` using `repo.getById(pool, req.params.id)`. Return 200 with the object or 404 if missing.
- **TODO 2:** Add route `POST /api/sightings` to validate body (`place`, `spookiness` 1..5, `investigator_id`), call `repo.create(pool, req.body)`, and return status 201.
- **TODO 3:** Add route `PATCH /api/sightings/:id` to load existing (`repo.getById`), merge fields (`{ ...existing, ...req.body }`), call `repo.update(...)`, and return status 200.

### 📁 `public/app.js`:
- **BUG E:** Table column prints `undefined` for spookiness because of a property name typo.

---

## 📋 The 10 Challenge Quiz Questions

Once you fix the bugs in `app.js` and `public/app.js`, run `npm run report` (or `node report.js`) to reveal the answers:

1. Total sightings count.
2. Highest avg spookiness place.
3. Busiest investigator name.
4. High spookiness count (> 4).
5. Number of sightings for place "Library 3rd floor" (using search).
6. Before fixing BUG E, what did the Spookiness column display?
7. Sighting ID 4 - investigator name.
8. Sighting ID 4 - spookiness score.
9. What HTTP status code does GET `/api/sightings/999` return?
10. What HTTP status code does a successful `POST /api/sightings` return?

---

## 🚀 How to Run locally:
```bash
npm install
npm run report
```
