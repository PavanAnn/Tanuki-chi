// server.js
import express from 'express'
import weebCentralRoutes from './WeebCentral/WeebCentralServer.js'
import mangaFoxRouter from './MangaFox/MangaFoxServer.js'

export function startExpressServer() {
  const app = express()
  const port = 3000

  app.use('/api/weebcentral', weebCentralRoutes)
  app.use('/api/mangafox', mangaFoxRouter)

  app.get('/', (req, res) => {
    res.send('Welcome to the main server!')
  })

  app.listen(port, '127.0.0.1', () => {
    console.log(`Server is running on http://127.0.0.1:${port}`)
  })
}
