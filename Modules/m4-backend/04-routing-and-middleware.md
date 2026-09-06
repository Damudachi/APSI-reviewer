# 04 - Routing and middleware

## The one-sentence answer

**Routing** decides *which* code runs for a given method + URL. **Middleware** is
code that runs *in between* the request arriving and your route replying - each
piece does one job and passes control to the next.

## Routing

A **route** is a method + path + handler:

```js
app.get('/sightings', listAll)          // GET  /sightings
app.get('/sightings/:id', getOne)       // GET  /sightings/42  -> req.params.id === '42'
app.post('/sightings', create)          // POST /sightings
app.patch('/sightings/:id', update)     // PATCH /sightings/42
app.delete('/sightings/:id', remove)    // DELETE /sightings/42
```

- The **method** (`get`, `post`, `patch`, `delete`, ...) matches the HTTP verb.
- **`:id`** is a **route parameter** - a placeholder that captures part of the
  path into `req.params.id`. It is always a **string** (`'42'`, not `42`).
- Express tries routes **top to bottom** and runs the **first** that matches, so
  order matters.

## Middleware: the pipeline

A **middleware function** has the signature `(req, res, next)`. It can inspect or
change `req`/`res`, then either **call `next()`** to pass control along, or **end
the request** by sending a response.

```mermaid
flowchart LR
    Req["Request"] --> M1["express.json()<br/>parse the body"]
    M1 -->|next| M2["logger<br/>print the request"]
    M2 -->|next| R["route handler<br/>send the response"]
    R --> Res["Response"]
    M2 -.->|res.status(401).end| Res
```

You register middleware with **`app.use(...)`**, and **order is everything** -
middleware runs in the order you add it, before the routes below it.

```js
app.use(express.json())          // 1. parse JSON bodies -> req.body
app.use((req, res, next) => {    // 2. a tiny logger
  console.log(`${req.method} ${req.path}`)
  next()                         // hand off to the next thing; forget this and the request hangs
})
app.get('/sightings', listAll)   // 3. routes run after the middleware above
```

### Built-in and third-party middleware

- **`express.json()`** - parses a JSON request body into `req.body`. Without it,
  `req.body` is `undefined` on POST/PATCH. You will add this in almost every API.
- **`express.static('public')`** - serves files from a folder.
- Third-party ones you install: `cors`, `morgan` (logging), `helmet` (security).

### Your own middleware

Anything cross-cutting - logging, timing, auth checks, attaching a request id -
is a good middleware, because it keeps that concern out of every route handler.

## Error handling middleware (the four-argument kind)

Express recognizes a middleware with **four** parameters as the **error handler**.
Registered **last**, it catches errors passed to `next(err)`:

```js
app.use((err, req, res, next) => {   // note: 4 args = error handler
  console.error(err)
  res.status(500).json({ error: 'Something went wrong' })
})
```

## The 404 fallback

Put a catch-all **after** all real routes. If nothing above matched, this runs:

```js
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})
```

Because Express matches top-to-bottom, a real route for `/sightings` still wins;
only unmatched paths fall through to here.

## Putting the order together

```js
const app = express()
app.use(express.json())            // parse bodies first
app.use(logger)                    // then cross-cutting middleware
app.get('/health', ...)            // then your routes
app.get('/sightings', ...)
app.use(notFound)                  // then the 404 fallback
app.use(errorHandler)              // then the error handler, last of all
```

## In one breath, for the exam

> **Routing** maps a method + path (with `:params` captured into `req.params`) to
> a handler, matched **top to bottom**. **Middleware** `(req, res, next)` runs in
> the pipeline between request and response - registered with `app.use` **in
> order** - and either calls `next()` or sends a response. `express.json()`
> populates `req.body`; a **4-argument** middleware is the **error handler**; a
> final `app.use` sends **404** for unmatched routes.

## References

- Express Documentation. *Routing*. https://expressjs.com/en/guide/routing.html
- Express Documentation. *Using middleware*. https://expressjs.com/en/guide/using-middleware.html
- Express Documentation. *Writing middleware*. https://expressjs.com/en/guide/writing-middleware.html
- Express Documentation. *Error handling*. https://expressjs.com/en/guide/error-handling.html
- MDN Web Docs. *Routes and controllers*. https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes
