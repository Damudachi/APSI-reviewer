# Module 5 - Activity 2 - PostgreSQL CRUD

[![Made with Claude](https://img.shields.io/badge/Made_with-Claude-D97757?logo=anthropic&logoColor=white)](https://tjakoen.github.io/notes/ten-times-zero)
![Node.js](https://img.shields.io/badge/Node.js-5FA04E?logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)

Build the **complete data-access layer** for HAUnted Sightings: all five CRUD
operations against PostgreSQL, in one focused module. In the capstone (m5a3) your
Express routes will sit on top of exactly these functions.

> **Read first:**
> [`m5-databases/03`](../m5-databases/03-connecting-node-to-postgresql.md) (parameterized
> queries) and [`m5-databases/04-crud-with-postgresql.md`](../m5-databases/04-crud-with-postgresql.md).

## 🎓 This activity is graded (50 points)

Unlike the earlier activities, this one carries points and instructor feedback:
**35 automated** (your tests pass) + **15 code quality** (reviewed from your
source). The code-quality half looks hardest at one thing: **are all your queries
parameterized?** The full breakdown is in [`RUBRIC.md`](RUBRIC.md) - read it
before you start.

## No database to install

The tests run against an **in-memory Postgres** (`pg-mem`); `npm test` works with
zero setup. `db.js` shows how you would connect to a real database.

## What to do

1. **Fill in `student.json`** (identical across your repos; `classCode` matches
   the repo name).
2. **Implement the data-access layer** in [`sightingsRepo.js`](sightingsRepo.js):
   `createSchema`, `create`, `getAll`, `getById`, `update`, and `remove`. Each is
   a single, focused function that runs **parameterized** SQL and returns a plain
   value (a row, an array, `null`, or a boolean). No HTTP here - this module knows
   nothing about Express.

> ⚠️ **Every value goes in as `$1, $2, ...` with a values array.** String
> concatenation of user input is an SQL-injection bug and costs code-quality
> points.

## Set up your repo

1. **Use this template -> Create a new repository.**
2. **Owner = the `HAU-6APSI` course org.**
3. **Name it** `m5a2-<classcode>-yourname`.
4. **Make it Private.**

```bash
git clone https://github.com/HAU-6APSI/m5a2-<classcode>-yourname.git
cd m5a2-<classcode>-yourname
```

## Running the tests

```bash
npm install
npm test
```

All tests must pass:

- ✅ `create`, `getAll`, `getById`, `update`, `remove` behave per the contract (including `null`/`false` on a missing id)
- ✅ All six fields in `student.json` are filled in

## Confirm your submission

**Pushing your work is how you submit it.**

```bash
git add -A
git commit -m "Module 5 Activity 2 complete"
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
