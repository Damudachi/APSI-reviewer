# Module 4 - Activity 1 - Node basics: the HAUnted Sightings core

[![Made with Claude](https://img.shields.io/badge/Made_with-Claude-D97757?logo=anthropic&logoColor=white)](https://tjakoen.github.io/notes/ten-times-zero)
![Node.js](https://img.shields.io/badge/Node.js-5FA04E?logo=nodedotjs&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)

Welcome to the back end. Over Modules 4 and 5 you build **one** small server: a
**HAUnted Sightings** API, a log of campus ghost sightings. This first activity
has no server yet - you write the app's **pure logic** as a plain Node module and
prove it works with tests. You will import these exact helpers from your Express
routes later.

> **Read first:** [`m4-backend/01-what-is-nodejs.md`](../m4-backend/01-what-is-nodejs.md)
> and [`m4-backend/02-npm-modules-package-json.md`](../m4-backend/02-npm-modules-package-json.md).

## What to do

### 1. Fill in your details

Open `student.json` and fill in every field:

```json
{
  "classCode": "1234",
  "fullName": "Juan Dela Cruz",
  "studentNumber": "2026-12345",
  "studentEmail": "juan.delacruz@hau.edu.ph",
  "personalEmail": "juan@example.com",
  "githubAccount": "juandelacruz"
}
```

Use the **class code** your instructor gave you (it also appears in your repo
name, e.g. `m4a1-1234-yourname`). Keep `student.json` identical across all your
activities - the autograder cross-checks these fields.

### 2. Implement the core module

Open [`haunt.js`](haunt.js) and implement and **export** the four functions the
comments describe:

- `slugify(place)` - a URL-safe slug from a place name
- `spookinessLabel(level)` - a label for a spookiness level 1..5
- `isRecent(reportedAt, now)` - was a sighting reported in the last 7 days?
- `validateSighting(sighting)` - `{ valid, errors }` for a sighting object

These are **pure functions**: given the same input they return the same output,
with no server and no side effects. That is exactly why they are easy to test.

## Set up your repo

Before you write any code, create **your own copy** of this activity from the
template. Do not work in the template itself.

1. **Create from the template.** Open the template repo and click
   **Use this template -> Create a new repository**.
2. **Set the owner to the course org.** Under *Owner*, choose the **`HAU-6APSI`
   course org**, **not** your personal account.
3. **Name it by the convention** `m<module>a<activity>-<classcode>-<yourname>`.
   For this activity that's **`m4a1-<classcode>-yourname`** (e.g.
   `m4a1-1234-juandelacruz`). The `<classcode>` must match `student.json`.
4. **Make it Private.** Set *Visibility* to **Private** so classmates can't see
   your work.

Then clone **your** new repo and work there:

```bash
git clone https://github.com/HAU-6APSI/m4a1-<classcode>-yourname.git
cd m4a1-<classcode>-yourname
```

## Running the tests

Install dependencies once:

```bash
npm install
```

Then run the tests:

```bash
npm test
```

All tests must pass:

- ✅ `slugify`, `spookinessLabel`, `isRecent`, and `validateSighting` behave as specified
- ✅ All six fields in `student.json` are filled in

## Confirm your submission

Your repo **is** your submission, so there is nothing to upload anywhere.
**Pushing your work is how you submit it.** When your tests pass locally,
**commit and push**:

```bash
git add -A
git commit -m "Module 4 Activity 1 complete"
git push
```

Pushing triggers the **Autograde** workflow on GitHub. Open the **Actions** tab,
open the latest **Autograde** run, and confirm the green ✅ check and the
"X / X tests passed" summary.

## 💻 Work in a Codespace (recommended)

A **Codespace** is a complete dev environment that runs in the cloud, so you do
not have to install Node on your own laptop. This repo is already configured:
open a Codespace and everything you need is ready.

**Open one:** click the green **Code** button → **Codespaces** tab → **Create
codespace on main**. The first launch takes a minute; after that it is instant.

**Use it in VS Code (recommended).** It works in the browser, but it is nicer in
the desktop app: install the **GitHub Codespaces** extension in VS Code, or from
the running Codespace click the menu (☰) → **Open in VS Code Desktop**.

### ⏱️ Make your free hours last (please read)
Your GitHub Education account includes a generous but limited monthly Codespaces
allowance. Three habits keep you from wasting it:

1. **Set your idle timeout to 10 minutes.** Go to
   **github.com/settings/codespaces → Default idle timeout → 10 minutes → Save.**
2. **Stop it when you finish - don't just close the tab.** Stop it at
   **github.com/codespaces → ••• → Stop codespace**, or run
   *Codespaces: Stop Current Codespace* from the Command Palette.
3. **Delete the Codespace once you've submitted this activity.** After your final
   push: **github.com/codespaces → ••• → Delete.**

---
📚 **These materials were authored by [tjakoen](https://github.com/tjakoen), built with Claude.** I use AI in the open, and I expect you to use it to learn the material, not to skip the learning. [How I actually work with AI →](https://tjakoen.github.io/notes/ten-times-zero)
