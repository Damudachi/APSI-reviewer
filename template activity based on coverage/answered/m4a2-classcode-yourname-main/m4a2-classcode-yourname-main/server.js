// Starts the server for real. Run it with `npm start`, then open
// http://localhost:3000/health in your browser.
//
// Notice the split: app.js BUILDS the app (and the tests import it), while this
// file STARTS it by calling listen. Keeping "build" separate from "start" is a
// habit that makes an app easy to test.

import { createApp } from './app.js'

const app = createApp()
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`HAUnted Sightings API listening on http://localhost:${port}`)
})
