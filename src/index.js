import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import auth from './routes/auth.routes'

dotenv.config()

const port = process.env.PORT ?? 3000
const app = express()

app.use(express.json())

app.listen(port)

app.use('/api/auth', auth)

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'errors', 'error.html'))
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).sendFile(path.join(__dirname, 'public', 'errors', 'error.html'))
})
