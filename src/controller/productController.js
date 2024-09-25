import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Funcion para cargar un nuevo producto a la db.

export const createProduct = async (req, res) => {
  try {
    const nameToCompare = req.body.name
    const manufacturerToCompare = req.body.manufacturer
    const presentationToCompare = req.body.presentation

    const productCompare = await prisma.product.findFirst({
      where: {
        name: { nameToCompare },
        manufacturer: { manufacturerToCompare },
        presentation: { presentationToCompare }
      }
    })

    if (productCompare) {
      return res
        .status(409)
        .json({ error: '¡El producto ya existe, verifique los datos!' })
    }

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

export const getAllProducts = async res => {
  try {
    const product = await prisma.product.findMany()
    if (product.length === 0) {
      res.status(404).json({ error: 'No existen productos para mostrar.' })
    }
    return res.status(200).json(product)
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener productos.' })
  } finally {
    prisma.$disconnect()
  }
}

// Funcion que devuelve un producto si le pasamos la id de dicho producto.

export const getProductById = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const product = await prisma.product.findUnique({ where: { id } })
    if (product) {
      return res.status(200).json(product)
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
  try {
    const id = parseInt(req.params.id)
    const productCompare = await prisma.product.findUnique({
      id: { id }
    })

    if (!productCompare) {
      return res.status(409).json({
        error: '¡Este producto no existe, porfavor verifique los datos!'
      })
    }
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
    return res.status(500).send({
      error: 'Error en el servidor, no se pudo actualizar el producto.'
    })
  } finally {
    await prisma.$disconnect()
  }
}

// Funcion para eliminar un  producto en la db a traves del iud.

export const deleteProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const productCompare = await prisma.product.findUnique({ where: { id } })
    if (!productCompare) {
      return res.status(409).json({
        error: '¡Este producto no existe, porfavor verifique los datos!'
      })
    }
    const product = await prisma.product.delete({
      where: { id }
    })

    if (product) {
      return res
        .status(200)
        .json({ message: '¡Producto eliminado exitosamente!' })
    }
  } catch (error) {
    return res.status(500).send({
      error: 'Error en el servidor, no se pudo eliminar el producto.'
    })
  } finally {
    await prisma.$disconnect()
  }
}

// Funcion para buscar un  producto en la db a traves del nombre.

export const searchProductByName = async (req, res) => {
  try {
    const name = req.params.name
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

// Funcion para buscar un  producto en la db a traves de la marca.

export const searchProductByBrand = async (req, res) => {
  try {
    const brand = req.params.brand
    const products = await prisma.product.findMany({
      where: {
        brand: {
          contains: brand
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

// Funcion para buscar un  producto en la db a traves de la presentacion.

export const searchProductByPresentation = async (req, res) => {
  try {
    const presentacion = req.params.presentation
    const products = await prisma.product.findMany({
      where: {
        presentation: {
          contains: presentacion
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
