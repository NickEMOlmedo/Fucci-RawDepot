import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Funcion para cargar un nuevo producto a la db.

export const uploadProduct = async (req, res) => {
  try {
    const { name, stock, brand, manufacturer, presentation, quality } = req.body

    const product = await prisma.product.create({
      data: {
        name,
        stock,
        brand,
        manufacturer,
        presentation,
        quality
      }
    })

    if (product) {
      res.status(201).json({ message: '¡Producto creado exitosamente!' })
    }
  } catch (error) {
    if (error.status === 400) {
      res.status(400).send({ error: '¡Porfavor verifique los datos!' })
    } else {
      res.status(500).send({ error: 'Error en el servidor.' })
    }
  } finally {
    await prisma.$disconnect()
  }
}

export const getAllProducts = async (req, res) => {
  try {
    const product = await prisma.product.findMany()

    res.status(200).json(product)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener productos.' })
  }
}

// Funcion que devuelve un producto si le pasamos la id de dicho producto.

export const getProductById = async (req, res) => {
  try {
    const productId = parseInt(req.params)

    if (isNaN(productId)) {
      res
        .status(400)
        .send({ error: '¡Porfavor verifique los datos!' + productId })
    }

    const product = await prisma.product.findUnique({ where: { productId } })
    const { id, name, stock, brand, manufacturer, presentation, quality } =
      product

    if (product) {
      return res.status(200).json({
        id,
        name,
        stock,
        brand,
        manufacturer,
        presentation,
        quality
      })
    }
  } catch (error) {
    if (error.status === 400) {
      res.status(400).send({ error: '¡Porfavor verifique los datos!' })
    } else {
      res.status(500).send({ error: 'Error en el servidor.' })
    }
  } finally {
    await prisma.$disconnect()
  }
}

// Funcion para modificar un nuevo producto en la db.

export const updateProduct = async (req, res) => {
  try {
    const { id, name, stock, brand, manufacturer, presentation, quality } =
      req.body

    const product = await prisma.product.update({
      where: {
        id
      },
      data: {
        name,
        stock,
        brand,
        manufacturer,
        presentation,
        quality
      }
    })

    if (product) {
      res.status(201).json({ message: '¡Producto actualizado exitosamente!' })
    }
  } catch (error) {
    if (error.status === 400) {
      res.status(400).send({ error: '¡Porfavor verifique los datos!' })
    } else {
      res.status(500).send({ error: 'Error en el servidor.' })
    }
  } finally {
    await prisma.$disconnect()
  }
}

// Funcion para eliminar un  producto en la db.

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.body

    const product = await prisma.product.delete({
      where: { id }
    })

    if (product) {
      res.status(200).json({ message: '¡Producto actualizado exitosamente!' })
    }
  } catch (error) {
    if (error.status === 400) {
      res.status(400).send({ error: '¡Porfavor verifique los datos!' })
    } else {
      res.status(500).send({ error: 'Error en el servidor.' })
    }
  } finally {
    await prisma.$disconnect()
  }
}

export const searchProduct = async (req, res) => {
  try {
    const { name } = req.body
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive'
        }
      }
    })

    if (products.length === 0) {
      res.status(404).json({
        error: 'No se encontraron productos que coincidan con la busqueda.'
      })
    }

    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar productos.' })
  } finally {
    await prisma.$disconnect()
  }
}
