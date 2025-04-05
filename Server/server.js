// server.js
import express from 'express'
import weebCentralRoutes from './WeebCentral/WeebCentralServer.js'
const app = express()
const port = 3000

// Import the WeebCentral API handlers

// Use the WeebCentral routes with a base path
app.use('/api/weebcentral', weebCentralRoutes) // All routes from WeebCentral.js are now prefixed with /api/weebcentral

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the main server!')
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
