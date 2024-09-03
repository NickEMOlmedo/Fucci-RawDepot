import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import auth from './routes/auth.routes.js'
import productRoutes from './routes/product.routes.js'
import cookieParser from 'cookie-parser'

dotenv.config()

const port = process.env.PORT ?? 3000
const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.listen(port)

app.get('/', (req, res) => {
  res.send('Server Running')
})
app.use('/api/auth', auth)
app.use('/api/product', productRoutes)
