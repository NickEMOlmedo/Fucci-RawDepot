import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Funcion que carga un nuevo ingreso de mercaderia.

export const uploadEntry = async (req, res) => {
  try {
    const {
      producType,
      receiptCode,
      deliveryCompany,
      entryDate,
      quantity,
      status,
      adminDni
    } = req.body

    const entry = prisma.entry.create({
      data: {
        productType: producType.toLowerCase(),
        receiptCode: receiptCode.toLowerCase(),
        deliveryCompany: deliveryCompany.toLowerCase(),
        entryDate: entryDate.toLowerCase(),
        quantity: quantity.toLowerCase(),
        status,
        adminDni
      }
    })

    if (entry) {
      return res.status(201).json({
        message: '¡Usted ha cargado un nuevo ingreso exitosamente!'
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Error en el servidor, no se pudo cargar el ingreso.'
    })
  } finally {
    prisma.$disconnect()
  }
}

// Funcion que muestra todos los ingresos disponibles.

export const getAllEntrys = async (req, res) => {
  try {
    const entry = await prisma.entry.findMany()
    if (entry) {
      return res.status(201).json(entry)
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener los ingresos.' })
  }
}

export const getEntryById = async (req, res) => {
  const id = parseInt(req.params.id)
  try {
    const entry = prisma.entry.findUnique({ where: { id } })
    if (entry) {
      const {
        producType,
        receiptCode,
        deliveryCompany,
        entryDate,
        quantity,
        status,
        adminDni
      } = entry
      return res.status(201).json({
        id,
        producType,
        receiptCode,
        deliveryCompany,
        entryDate,
        quantity,
        status,
        adminDni
      })
    } else {
      return res.status(404).json({ error: '¡Ingreso no encontrado!' })
    }
  } catch (error) {
    return res.status(500).send({ error: 'Error en el servidor.' })
  } finally {
    prisma.$disconnect()
  }
}

// Funcion para modificar o actualizar un ingreso de mercaderia.

export const updateEntry = async (req, res) => {
  const id = parseInt(req.params.id)
  try {
    const {
      producType,
      receiptCode,
      deliveryCompany,
      entryDate,
      quantity,
      status,
      adminDni
    } = req.body

    const entry = prisma.entry.update({
      where: { id },
      data: {
        productType: producType.toLowerCase(),
        receiptCode: receiptCode.toLowerCase(),
        deliveryCompany: deliveryCompany.toLowerCase(),
        entryDate: entryDate.toLowerCase(),
        quantity,
        status: status.toLowerCase(),
        adminDni
      }
    })

    if (entry) {
      return res.status(201).json({
        message: '¡Usted ha actualizado el ingreso exitosamente!'
      })
    }
  } catch (error) {
    return res.status(404).json({
      message: 'Error en el servidor, no se pudo actualizar el ingreso.'
    })
  } finally {
    prisma.$disconnect()
  }
}

export const deleteEntry = async (req, res) => {
  const id = parseInt(req.params.id)
  try {
    const entry = await prisma.entry.delete({
      where: {
        id: { id }
      }
    })

    if (entry) {
      return res
        .status(200)
        .json({ message: 'Ingreso eliminado exitosamente!' })
    }
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(400).send({ error: 'Ingreso no encontrado!' })
    } else {
      return res.status(500).send({
        error: 'Error en el servidor, no se pudo eliminar el ingreso.'
      })
    }
  }
}

// Funcion para buscar ingresos por tipo de producto.

export const searchEntryByProductType = async (req, res) => {
  const productType = req.params.productType
  try {
    const entry = await prisma.entry.findMany({
      where: {
        producType: { contains: productType }
      }
    })

    if (entry.length === 0) {
      res.status(404).json({
        error: 'No se encontraron ingresos que coincidan con la busqueda.'
      })
    }
    return res.status(200).json(entry)
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar ingresos.' })
  } finally {
    await prisma.$disconnect()
  }
}

// Funcion para buscar ingresos por compañia que envia.

export const searchEntryByDeliveryCompany = async (req, res) => {
  const deliveryCompany = req.params.deliveryCompany
  try {
    const entry = await prisma.entry.findMany({
      where: {
        deliveryCompany: { contains: deliveryCompany }
      }
    })

    if (entry.length === 0) {
      res.status(404).json({
        error: 'No se encontraron ingresos que coincidan con la busqueda.'
      })
    }
    return res.status(200).json(entry)
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar ingresos.' })
  } finally {
    await prisma.$disconnect()
  }
}

// Funcion pra buscar ingresos por fecha .

export const searchEntryByDate = async (req, res) => {
  const entryDate = req.params.entryDate
  try {
    const entry = await prisma.entry.findMany({
      where: {
        entryDate: new Date(entryDate)
      }
    })

    if (entry.length === 0) {
      res.status(404).json({
        error: 'No se encontraron ingresos que coincidan con la busqueda.'
      })
    }
    return res.status(200).json(entry)
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar ingresos.' })
  } finally {
    prisma.$disconnect()
  }
}

// Funcion para buscar ingresos por el dni del admin.

export const searchEntryByAdmin = async (req, res) => {
  const adminDni = req.params.adminDni
  try {
    const entry = await prisma.entry.findMany({
      where: {
        dni: { adminDni }
      }
    })

    if (entry.length === 0) {
      res.status(404).json({
        error: 'No se encontraron ingresos que coincidan con la busqueda.'
      })
    }
    return res.status(200).json(entry)
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar ingresos.' })
  } finally {
    prisma.$disconnect()
  }
}

// Funcion para buscar ingresos por el status del producto al ingresar.

export const searchEntryByStatus = async (req, res) => {
  const status = req.params.status
  try {
    const entry = await prisma.entry.findMany({
      where: {
        status: { status }
      }
    })

    if (entry.length === 0) {
      res.status(404).json({
        error: 'No se encontraron ingresos que coincidan con la busqueda.'
      })
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar ingresos.' })
  } finally {
    prisma.$disconnect()
  }
}
