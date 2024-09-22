import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import employeeRoutes from './routes/employee.routes'
import productRoutes from './routes/product.routes'
import entryRoutes from './routes/entry.routes'
import lotRoutes from './routes/lot.routes'
import withdrawalRoutes from './routes/withdrawal.routes'
import withdrawatlDetailRoutes from './routes/withdrawalDetails.routes'

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

app.use('/api/employee', employeeRoutes)
app.use('/api/product', productRoutes)
app.use('/api/entry', entryRoutes)
app.ue('/api/lot', lotRoutes)
app.use('/api/withdrawal', withdrawalRoutes)
app.use('api/withdrawalDetail', withdrawatlDetailRoutes)
