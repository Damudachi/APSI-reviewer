# Module 4 - Activity 3 - A RESTful API (in-memory)

[![Made with Claude](https://img.shields.io/badge/Made_with-Claude-D97757?logo=anthropic&logoColor=white)](https://tjakoen.github.io/notes/ten-times-zero)
![Node.js](https://img.shields.io/badge/Node.js-5FA04E?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![REST](https://img.shields.io/badge/REST-API-005f9e)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)

Now the HAUnted Sightings API gets **full CRUD**: create, read, update, and
delete sightings, following REST conventions - the right verb, the right URL, the
right status code. The data lives in an in-memory array, so it resets on restart.
That is deliberate: feeling that data loss is what makes Module 5 (PostgreSQL)
click.

> **Read first (carefully):**
> [`m4-backend/05-restful-design-patterns.md`](../m4-backend/05-restful-design-patterns.md).
> It defines the verb/URL/status-code contract you are implementing.

## The REST contract

| Method | URL | Success | Missing id | Bad input |
| --- | --- | --- | --- | --- |
| GET | `/sightings` | 200 + array | - | - |
| GET | `/sightings/:id` | 200 + one | 404 | - |
| POST | `/sightings` | 201 + created | - | 400 |
| PATCH | `/sightings/:id` | 200 + updated | 404 | - |
| DELETE | `/sightings/:id` | 204 (no body) | 404 | - |

## What to do

1. **Fill in `student.json`** (identical across your repos; `classCode` matches
   the repo name).
2. **Implement the five routes** in [`app.js`](app.js) inside `createApp()`, per
   the table above. A new sighting gets a fresh `id` and a `reportedAt` timestamp
   (`new Date().toISOString()`). Validate POST bodies: `place` must be a non-empty
   string and `spookiness` an integer from 1 to 5.

Run it for real with `npm start` and poke it with `curl` (see `server.js`).

## Set up your repo

1. **Use this template -> Create a new repository.**
2. **Owner = the `HAU-6APSI` course org.**
3. **Name it** `m4a3-<classcode>-yourname`.
4. **Make it Private.**

```bash
git clone https://github.com/HAU-6APSI/m4a3-<classcode>-yourname.git
cd m4a3-<classcode>-yourname
```

## Running the tests

```bash
npm install
npm test
```

All tests must pass:

- ✅ list, read-one (+ 404), create (+ 400), update (+ 404), delete (+ 404) behave per the contract
- ✅ All six fields in `student.json` are filled in

## Confirm your submission

**Pushing your work is how you submit it.**

```bash
git add -A
git commit -m "Module 4 Activity 3 complete"
git push
```

Then open the **Actions** tab and confirm the green ✅ **Autograde** run.

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
