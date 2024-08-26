import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import auth from './routes/auth.routes.js'
import cookieParser from 'cookieParser'

dotenv.config()

const port = process.env.PORT ?? 3000
const app = express()

app.use(cors())
app.use(cookieParser())
app.use(express.json())

app.listen(port)

app.get('/', (req, res) => {
  res.send('Server Running')
})
app.use('/api/auth', auth)
