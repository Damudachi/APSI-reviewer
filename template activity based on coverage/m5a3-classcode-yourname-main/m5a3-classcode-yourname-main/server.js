// Starts the persistent API for real against a real PostgreSQL database.
//
// Set DATABASE_URL (see .env.example), make sure Postgres is running, then:
//   npm start
// The app creates the table on boot, then listens. Try it:
//   curl http://localhost:3000/sightings

import { createApp } from './app.js'
import { createPool } from './db.js'
import { createSchema } from './sightingsRepo.js'

const pool = createPool()
await createSchema(pool)

const app = createApp(pool)
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`HAUnted Sightings API (Postgres) listening on http://localhost:${port}`)
})
