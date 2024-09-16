import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Funcion para cargar un nuevo producto a la db.

export const uploadProduct = async (req, res) => {
  try {
    const { name, stock, brand, manufacturer, presentation, quality } = req.body
    const product = await prisma.product.create({
      data: {
        name: name.toLowerCase(),
        brand: brand.toLowerCase(),
        manufacturer: manufacturer.toLowerCase(),
        presentation: presentation.toLowerCase(),
        quality,
        stock
      }
    })

    if (product) {
      return res.status(201).json({ message: '¡Producto creado exitosamente!' })
    }
  } catch (error) {
    return res
      .status(500)
      .send({ error: 'Error en el servidor, no se pudo cargar el producto.' })
  } finally {
    await prisma.$disconnect()
  }
}

// Funcion que devuelve todos los productos que existan en la db.

export const getAllProducts = async (req, res) => {
  try {
    const product = await prisma.product.findMany()
    if (product) {
      return res.status(201).json(product)
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener productos.' })
  } finally {
    prisma.$disconnect()
  }
}

// Funcion que devuelve un producto si le pasamos la id de dicho producto.

export const getProductById = async (req, res) => {
  const id = parseInt(req.params.id)
  try {
    const product = await prisma.product.findUnique({ where: { id } })
    if (product) {
      const { name, brand, manufacturer, presentation, quality, stock } =
        product
      return res.status(200).json({
        id,
        name,
        brand,
        manufacturer,
        presentation,
        quality,
        stock
      })
    } else {
      return res.status(404).json({ error: '¡Producto no encontrado!' })
    }
  } catch (error) {
    return res.status(500).send({ error: 'Error en el servidor.' })
  } finally {
    await prisma.$disconnect()
  }
}

// Funcion para modificar un producto en la db.

export const updateProduct = async (req, res) => {
  const id = parseInt(req.params.id)
  try {
    const { name, brand, manufacturer, presentation, quality, stock } = req.body
    const product = await prisma.product.update({
      where: {
        id
      },
      data: {
        name: name.toLowerCase(),
        brand: brand.toLowerCase(),
        manufacturer: manufacturer.toLowerCase(),
        presentation: presentation.toLowerCase(),
        quality,
        stock
      }
    })

    if (product) {
      return res
        .status(201)
        .json({ message: '¡Producto actualizado exitosamente!' })
    }
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(400).send({ error: '¡Producto no encontrado!' })
    } else {
      return res.status(500).send({
        error: 'Error en el servidor, no se pudo actualizar el producto.'
      })
    }
  } finally {
    await prisma.$disconnect()
  }
}

// Funcion para eliminar un  producto en la db a traves del iud.

export const deleteProduct = async (req, res) => {
  const id = parseInt(req.params.id)
  try {
    const product = await prisma.product.delete({
      where: { id }
    })

    if (product) {
      return res
        .status(200)
        .json({ message: '¡Producto eliminado exitosamente!' })
    }
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(400).send({ error: '¡Producto no encontrado!' })
    } else {
      return res.status(500).send({
        error: 'Error en el servidor, no se pudo eliminar el producto.'
      })
    }
  } finally {
    await prisma.$disconnect()
  }
}

// Funcion para buscar un  producto en la db a traves del nombre.

export const searchProduct = async (req, res) => {
  const name = req.params.name
  try {
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: name
        }
      }
    })

    if (products.length === 0) {
      res.status(404).json({
        error: 'No se encontraron productos que coincidan con la busqueda.'
      })
    }
    return res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar productos.' })
  } finally {
    await prisma.$disconnect()
  }
}
