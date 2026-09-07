// Starts the API for real. Run `npm start`, then try it with curl or a browser:
//   curl http://localhost:3000/sightings
//   curl -X POST http://localhost:3000/sightings \
//     -H 'Content-Type: application/json' \
//     -d '{"place":"Chapel","spookiness":3}'

import { createApp } from './app.js'

const app = createApp()
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`HAUnted Sightings API listening on http://localhost:${port}`)
})
