import express from 'express';

import administradorRoutes from './administradores.routes'
import empleadosRoutes from './empleados.routes'
import productosRoutes from './productos.routes'
import lotesProductosRoutes from './lotes-productos.routes'
import ingresosRoutes from './ingresos.routes'
import retirosRoutes from './retiros.routes'
import detallesRetirosRoutes from './detalles-retiros'

const app = express();

app.use(express.json());

app.use('/api', administradorRoutes)
app.use('/api', empleadosRoutes)
app.use('/api', productosRoutes)
app.use('/api', lotesProductosRoutes)
app.use('/api', ingresosRoutes)
app.use('/api', retirosRoutes)
app.use('/api', detallesRetirosRoutes)


