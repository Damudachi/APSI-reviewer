// Starts the API for real against a real PostgreSQL database.
//
// Set DATABASE_URL (see .env.example), make sure Postgres is running, then:
//   npm start
// The app creates both tables on boot, then listens. Try it:
//   curl http://localhost:3000/investigators

import { createApp } from './app.js'
import { createPool } from './db.js'
import { createSchema } from './schema.js'

const pool = createPool()
await createSchema(pool)

const app = createApp(pool)
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`HAUnted Sightings API v2 listening on http://localhost:${port}`)
})
