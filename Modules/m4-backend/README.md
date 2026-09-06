# Module 4 - Node.js and Express (the back end)

Modules 1 to 3 were all **front end** - the part of an app that runs in the
browser. Module 4 crosses to the **back end**: the server that listens for
requests and sends back data. Same language (JavaScript), new powers.

You will learn what Node.js is, how npm and modules work, how to stand up an
**Express** server, how routes and middleware fit together, and the **RESTful**
conventions every good API follows. By the end of the module you have a working
API - it just keeps its data in memory for now (Module 5 makes it permanent).

## The running app: HAUnted Sightings

Across Modules 4 and 5 you build **one** small backend: a **HAUnted Sightings**
API, a log of campus ghost sightings. Each activity extends the same app, so you
are always adding to something real rather than starting cold.

```
Resource: a "sighting"
{ id, place, description, spookiness (1-5), reportedAt }
```

## The reading

Read these in order. Each activity tells you which ones it needs; the short
version is in the table under "The activities" below.

| # | File | Covers |
| --- | --- | --- |
| 01 | [What is Node.js](01-what-is-nodejs.md) | the runtime, V8, the event loop, non-blocking I/O, Node vs the browser |
| 02 | [npm, modules, and package.json](02-npm-modules-package-json.md) | ESM vs CommonJS, `import`/`export`, dependencies vs devDependencies, scripts, semver, the lockfile |
| 03 | [What is Express](03-what-is-express.md) | why a framework over raw `http`, the request-response cycle, `req`/`res`, the `app` object |
| 04 | [Routing and middleware](04-routing-and-middleware.md) | routes and `:params`, the middleware pipeline, `next()`, `express.json()`, error + 404 handling, order |
| 05 | [RESTful design patterns](05-restful-design-patterns.md) | resources vs verbs, the CRUD-to-HTTP map, status codes, safe/idempotent, statelessness, URL design |

> These are discussion notes with lots of code: read a section, then come to
> class ready to talk about it. Nothing here is graded directly, but it is the
> language you will use to reason about every activity.

The database side is covered in [`../m5-databases/`](../m5-databases/), which you
reach in Module 5.

## The activities

Each builds directly on the last:

| Activity | You build | New ideas | Read first |
| --- | --- | --- | --- |
| **m4a1** - Node basics | the app's **pure logic module** (`slugify`, `spookinessLabel`, `isRecent`, `validateSighting`) - no server yet | modules, `import`/`export`, `package.json`, npm scripts | 01, 02 |
| **m4a2** - Your first Express server | the server: `GET /health`, `GET /sightings` (a hardcoded seed), a logger middleware, a 404 handler | `express()`, routes, middleware, `req`/`res` | 03, 04 |
| **m4a3** - A RESTful API | full **CRUD** over an in-memory list of sightings, reusing your m4a1 helpers | REST verbs, status codes (200/201/204/404), route params, request bodies | 05 |

> **Why in-memory first?** m4a3's data lives in a JavaScript array, so it resets
> every time the server restarts. That is on purpose - feeling that data loss is
> what makes Module 5 (PostgreSQL) click. You will move the exact same API onto a
> real database there.

## How these are graded

All three Module 4 activities are **test-only** (like Modules 1 and 2): your
Vitest suite must pass. Points and instructor feedback arrive with the Module 5
capstones, where the app becomes persistent.
