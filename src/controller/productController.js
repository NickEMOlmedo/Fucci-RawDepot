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
        quality: quality.toLowerCase(),
        stock
      }
    })

    if (product) {
      return res.status(201).json({ message: '¡Producto creado exitosamente!' })
    }
  } catch (error) {
    if (error.status === 400) {
      return res.status(400).send({ error: '¡Porfavor verifique los datos!' })
    } else {
      return res.status(500).send({ error: 'Error en el servidor.' })
    }
  } finally {
    await prisma.$disconnect()
  }
}

// Funcion que devuelve todos los productos que existan en la db.

export const getAllProducts = async (req, res) => {
  try {
    const product = await prisma.product.findMany()
    return res.status(200).json(product)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error al obtener productos.' })
  }
}

// Funcion que devuelve un producto si le pasamos la id de dicho producto.

export const getProductById = async (req, res) => {
  const productId = parseInt(req.params.id)
  if (isNaN(productId)) {
    return res
      .status(400)
      .send({ error: '¡El ID del producto debe ser numerico!' })
  }

  // Si pasa la verificacion y realmente es un numero, ahi asignamos ese valor a id.

  const id = productId

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
      return res.status(404).json({ error: 'Producto No encontrado.' })
    }
  } catch (error) {
    return res.status(500).send({ error: 'Error en el servidor.' })
  } finally {
    await prisma.$disconnect()
  }
}

// Funcion para modificar un producto en la db.

export const updateProduct = async (req, res) => {
  try {
    const { id, name, brand, manufacturer, presentation, quality, stock } =
      req.body

    const product = await prisma.product.update({
      where: {
        id
      },
      data: {
        name: name.toLowerCase(),
        brand: brand.toLowerCase(),
        manufacturer: manufacturer.toLowerCase(),
        presentation: presentation.toLowerCase(),
        quality: quality.toLowerCase(),
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
      return res.status(500).send({ error: 'Error en el servidor.' })
    }
  } finally {
    await prisma.$disconnect()
  }
}

// Funcion para eliminar un  producto en la db a traves del iud.

export const deleteProduct = async (req, res) => {
  const productId = parseInt(req.params.id)
  if (isNaN(productId)) {
    return res
      .status(400)
      .send({ error: '¡El ID del producto debe ser numerico!' })
  }

  // Si pasa la verificacion y realmente es un numero, ahi asignamos ese valor a id.

  const id = productId

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
      return res.status(500).send({ error: 'Error en el servidor.' })
    }
  } finally {
    await prisma.$disconnect()
  }
}

// Funcion para buscar un  producto en la db a traves del nombre.

export const searchProduct = async (req, res) => {
  const name = req.params.name
  if (!name) {
    return res.status(400).json({ error: 'Falta el parámetro de búsqueda.' })
  }

  try {
    console.log(name)
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
