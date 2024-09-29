import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import adminRoutes from './routes/admin.routes.js'
import employeeRoutes from './routes/employee.routes.js'
import productRoutes from './routes/product.routes.js'
import entryRoutes from './routes/entry.routes.js'
import lotRoutes from './routes/lot.routes.js'
import withdrawalRoutes from './routes/withdrawal.routes.js'
import withdrawatlDetailRoutes from './routes/withdrawalDetails.routes.js'

dotenv.config()

const port = process.env.PORT ?? 3000
const app = express()

app.use(helmet())
app.use(
  helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true
  })
)

app.use(cors({ origin: 'localhost', optionsSuccessStatus: 200 }))
app.use(express.json())
app.use(cookieParser())

app.listen(port)

app.get('/', (req, res) => {
  res.send('Server Running')
})

app.use('/api/admins', adminRoutes)
app.use('/api/employees', employeeRoutes)
app.use('/api/products', productRoutes)
app.use('/api/entrys', entryRoutes)
app.use('/api/lots', lotRoutes)
app.use('/api/withdrawals', withdrawalRoutes)
app.use('/api/withdrawal-details', withdrawatlDetailRoutes)
