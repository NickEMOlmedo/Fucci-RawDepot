import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const uploadProduct = async (req, res) => {
  try {
    const { name, stock, brand, manufacturer, presentation, quality, lots } =
      req.body

    const product = await prisma.product.create({
      data: {
        name,
        stock,
        brand,
        manufacturer,
        presentation,
        quality,
        lots
      }
    })

    if (product) {
      res.status(201).json({ message: 'Producto creado exitosamente' })
    }
  } catch (error) {
    if (error.isValidationError) {
      res.status(400).send({ error: '¡Porfavor verifique los datos!' })
    } else {
      res.status(500).send({ error: 'Error en el servidor.' })
    }
  }
}
