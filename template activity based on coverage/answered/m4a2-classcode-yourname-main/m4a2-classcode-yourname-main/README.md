# Module 4 - Activity 2 - Your first Express server

[![Made with Claude](https://img.shields.io/badge/Made_with-Claude-D97757?logo=anthropic&logoColor=white)](https://tjakoen.github.io/notes/ten-times-zero)
![Node.js](https://img.shields.io/badge/Node.js-5FA04E?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)

Time to bring the HAUnted Sightings API to life. You will stand up an **Express**
server with a health check, a route that lists sightings from a seed list, a
custom **middleware**, and a **404** fallback. No database yet - that is Module 5.

> **Read first:** [`m4-backend/03-what-is-express.md`](../m4-backend/03-what-is-express.md)
> and [`m4-backend/04-routing-and-middleware.md`](../m4-backend/04-routing-and-middleware.md).

## What to do

### 1. Fill in your details

Open `student.json` and fill in every field (same as your other activities - keep
it identical across repos, and match the `classCode` in your repo name).

### 2. Build the server

Open [`app.js`](app.js) and complete `createApp()` so it returns an Express app
that:

- uses `express.json()` to parse JSON bodies;
- runs a **custom middleware** that sets a response header `X-Api` to
  `haunted-sightings`, logs `METHOD /path`, and calls `next()`;
- answers **`GET /health`** with `200` and `{ "status": "ok" }`;
- answers **`GET /sightings`** with `200` and the seed array;
- answers **any other route** with `404` and `{ "error": "Not found" }`.

Notice `createApp()` **returns** the app instead of calling `app.listen`. That is
so the tests can drive it in memory. To run it for real: `npm start`, then open
<http://localhost:3000/health> (`server.js` does the `listen`).

## Set up your repo

1. **Create from the template** (**Use this template -> Create a new repository**).
2. **Owner = the `HAU-6APSI` course org**, not your personal account.
3. **Name it** `m4a2-<classcode>-yourname` (the `<classcode>` must match
   `student.json`).
4. **Make it Private.**

```bash
git clone https://github.com/HAU-6APSI/m4a2-<classcode>-yourname.git
cd m4a2-<classcode>-yourname
```

## Running the tests

```bash
npm install
npm test
```

All tests must pass:

- ✅ `GET /health` returns `{ status: "ok" }` and the middleware sets `X-Api`
- ✅ `GET /sightings` returns a non-empty array of sightings
- ✅ unknown routes return `404`
- ✅ All six fields in `student.json` are filled in

## Confirm your submission

**Pushing your work is how you submit it.** When your tests pass locally:

```bash
git add -A
git commit -m "Module 4 Activity 2 complete"
git push
```

Pushing triggers the **Autograde** workflow. Open the **Actions** tab, open the
latest **Autograde** run, and confirm the green ✅ check and the summary.

## 💻 Work in a Codespace (recommended)

A **Codespace** is a cloud dev environment, already configured here - no local
install needed. Open one: green **Code** button → **Codespaces** → **Create
codespace on main**. Nicer in VS Code Desktop (☰ → **Open in VS Code Desktop**).

### ⏱️ Make your free hours last (please read)

1. **Idle timeout 10 min:** **github.com/settings/codespaces → Default idle
   timeout → 10 minutes → Save.**
2. **Stop it when you finish** - don't just close the tab
   (**github.com/codespaces → ••• → Stop codespace**).
3. **Delete the Codespace once submitted** (**github.com/codespaces → ••• →
   Delete**).

---
📚 **These materials were authored by [tjakoen](https://github.com/tjakoen), built with Claude.** I use AI in the open, and I expect you to use it to learn the material, not to skip the learning. [How I actually work with AI →](https://tjakoen.github.io/notes/ten-times-zero)
