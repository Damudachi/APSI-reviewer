# 03 - What is Express?

## The one-sentence answer

**Express is a small, popular framework for building web servers and APIs in
Node.** It turns the tedious, low-level work of handling HTTP requests into a few
readable lines.

## The problem: raw Node HTTP is painful

Node has a built-in `http` module, so you *can* write a server with zero
dependencies:

```js
import { createServer } from 'node:http'

createServer((req, res) => {
  if (req.url === '/sightings' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(sightings))
  } else {
    res.writeHead(404)
    res.end('Not found')
  }
}).listen(3000)
```

Notice the pain: you match the URL and method by hand with `if`s, set headers
manually, stringify JSON yourself, and handle "not found" everywhere. For a real
API with many routes this becomes a tangle.

## The solution: Express

Express wraps that same `http` server and gives you clean **routing** and
**middleware**. The equivalent is:

```js
import express from 'express'

const app = express()
app.get('/sightings', (req, res) => {
  res.json(sightings) // sets the header and stringifies for you
})
app.listen(3000)
```

`app.get('/sightings', handler)` reads as "when a **GET** request hits
**/sightings**, run this **handler**." That readability, across dozens of routes,
is the whole point.

## The request-response cycle

Every interaction with your server is one **request** in, one **response** out.

```mermaid
flowchart LR
    Client["Client<br/>(browser, app, curl)"] -->|HTTP request<br/>GET /sightings| App["Express app"]
    App -->|runs matching route handler| Handler["(req, res) => ..."]
    Handler -->|res.json(...)| Client
```

Your handler receives two objects:

- **`req`** (the request): what the client sent. Useful bits:
  - `req.params` - values from the URL path, e.g. `/sightings/:id` gives `req.params.id`
  - `req.query` - the `?key=value` query string
  - `req.body` - the JSON payload (only after you add the `express.json()` middleware)
  - `req.method`, `req.path`
- **`res`** (the response): how you reply. Useful methods:
  - `res.json(data)` - send JSON (sets `Content-Type` and stringifies)
  - `res.status(201)` - set the status code (chainable: `res.status(201).json(x)`)
  - `res.send(text)` - send text/HTML
  - `res.end()` - finish with no body (e.g. after `res.status(204)`)

**You must send exactly one response per request** - forgetting to call
`res.json`/`res.send`/`res.end` leaves the client hanging; calling two throws.

## The app object

`const app = express()` creates your application. On it you:

- **register routes**: `app.get`, `app.post`, `app.put`, `app.patch`, `app.delete`
- **register middleware**: `app.use(...)` (next doc)
- **start listening**: `app.listen(port)` - though for **testing** we `export` the
  `app` and never call `listen`, so a test tool (supertest) can drive it in
  memory. Keeping "build the app" separate from "start the server" is a habit
  worth forming early.

## Library vs framework (a familiar distinction)

Like React, Express is deliberately minimal - it gives you routing and middleware
and stays out of your way on databases, auth, and structure. That is why it is
called **unopinionated**: you assemble the rest (a database driver like `pg`, a
validator, etc.) yourself. Bigger frameworks (NestJS) add more structure on top
of Express-style ideas.

## In one breath, for the exam

> Express is a minimal, unopinionated **web framework** for Node that wraps the
> built-in `http` module with clean **routing** (`app.get('/path', handler)`) and
> **middleware**. Each request runs a handler that receives **`req`** (params,
> query, body) and **`res`** (`res.status(...).json(...)`), and must send exactly
> one response. `express()` creates the app; `app.listen(port)` starts it.

## References

- Express Documentation. *Hello world example*. https://expressjs.com/en/starter/hello-world.html
- Express Documentation. *Basic routing*. https://expressjs.com/en/starter/basic-routing.html
- Express Documentation. *Request* and *Response* API. https://expressjs.com/en/4x/api.html
- MDN Web Docs. *Express/Node introduction*. https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Introduction
- Node.js Documentation. *HTTP module*. https://nodejs.org/api/http.html
