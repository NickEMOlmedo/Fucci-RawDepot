import prisma from '../libs/db.js'

// Funcion que carga un nuevo ingreso de mercaderia.

export const createEntry = async (req, res) => {
  try {
    const productToCompare = req.body.productId
    const receiptCodeToCompare = req.body.receiptCode
    const deliveryCompanyToCompare = req.body.deliveryCompany

    const entryCompare = await prisma.entry.findFirst({
      where: {
        productId: parseInt(productToCompare),
        receiptCode: receiptCodeToCompare.toLowerCase(),
        deliveryCompany: deliveryCompanyToCompare.toLowerCase()
      }
    })

    if (entryCompare) {
      return res.status(409).json({
        error: '¡Este ingreso ya existe, porfavor verifique los datos!'
      })
    }

    const {
      productId,
      receiptCode,
      deliveryCompany,
      quantity,
      status,
      adminId
    } = req.body

    const entry = await prisma.entry.create({
      data: {
        productId: parseInt(productId),
        receiptCode: receiptCode.toLowerCase(),
        deliveryCompany: deliveryCompany.toLowerCase(),
        quantity: parseInt(quantity),
        status: status ? status.toLowerCase() : entryCompare.status,
        adminId: parseInt(adminId)
      }
    })

    await prisma.product.update({
      where: { id: parseInt(productId) },
      data: { stock: { increment: parseInt(quantity) } }
    })

    return res.status(201).json({ message: '¡Ingreso cargado exitosamente!' })
  } catch (error) {
    return res.status(500).json({
      message: 'Error en el servidor, no se pudo cargar el ingreso.'
    })
  }
}

// Funcion que muestra todos los ingresos disponibles.

export const getAllEntrys = async (req, res) => {
  try {
    const entry = await prisma.entry.findMany()
    if (entry.length === 0) {
      return res
        .status(404)
        .json({ error: 'No existen ingresos para mostrar.' })
    }
    return res.status(200).json(entry)
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudieron obtener los ingresos.'
    })
  }
}

// Funcion que retorna un ingreso segun el id.

export const getEntryById = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const entry = await prisma.entry.findUnique({ where: { id } })
    if (entry) {
      return res.status(200).json(entry)
    } else {
      return res.status(404).json({ error: '¡Ingreso no encontrado!' })
    }
  } catch (error) {
    return res
      .status(500)
      .send({ error: 'Error en el servidor, no se pudo obtener el ingreso' })
  }
}

// Funcion para modificar un ingreso de mercaderia.

export const updateEntry = async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    const entryCompare = await prisma.entry.findUnique({
      where: { id }
    })

    if (!entryCompare) {
      return res.status(404).json({
        error: '¡Este ingreso no existe, por favor verifique los datos!'
      })
    }

    const {
      productId,
      receiptCode,
      deliveryCompany,
      entryDate,
      quantity,
      status
    } = req.body

    const newProductId = productId
      ? parseInt(productId)
      : entryCompare.productId
    const newQuantity = quantity ? parseInt(quantity) : entryCompare.quantity

    if (parseInt(newProductId) !== entryCompare.productId) {
      await prisma.product.update({
        where: { id: entryCompare.productId },
        data: { stock: { decrement: entryCompare.quantity } }
      })

      await prisma.product.update({
        where: { id: newProductId },
        data: { stock: { increment: parseInt(newQuantity) } }
      })
    } else if (parseInt(newQuantity) !== entryCompare.quantity) {
      const stockAdjust = parseInt(newQuantity) - entryCompare.quantity
      await prisma.product.update({
        where: { id: parseInt(newProductId) },
        data: { stock: { increment: parseInt(stockAdjust) } }
      })
    }

    const entry = await prisma.entry.update({
      where: { id },
      data: {
        productId: newProductId
          ? parseInt(newProductId)
          : entryCompare.productId,
        receiptCode: receiptCode
          ? receiptCode.toLowerCase()
          : entryCompare.receiptCode,
        deliveryCompany: deliveryCompany
          ? deliveryCompany.toLowerCase()
          : entryCompare.deliveryCompany,
        quantity: newQuantity ? parseInt(newQuantity) : entryCompare.quantity,
        status: status ? status.toLowerCase() : entryCompare.status
      }
    })

    return res.status(201).json({
      message: '¡Ingreso actualizado exitosamente!'
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudo actualizar el ingreso.'
    })
  }
}

export const deleteEntry = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const entryCompare = await prisma.entry.findUnique({
      where: {
        id
      }
    })

    if (!entryCompare) {
      return res.status(404).json({
        error: '¡Este ingreso no existe, porfavor verifique los datos!'
      })
    }

    await prisma.entry.delete({
      where: {
        id
      }
    })

    return res.status(200).json({ message: 'Ingreso eliminado exitosamente!' })
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudo eliminar el ingreso.'
    })
  }
}

// Funcion para buscar ingresos por tipo de producto.

export const searchEntryByProductId = async (req, res) => {
  try {
    const productId = parseInt(req.params.product_id)
    const entry = await prisma.entry.findMany({
      where: {
        productId: { equals: productId }
      }
    })

    if (entry.length === 0) {
      return res.status(404).json({
        error: 'No se encontraron ingresos que coincidan con la busqueda.'
      })
    }
    return res.status(200).json(entry)
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudieron buscar los ingresos.'
    })
  }
}

// Funcion para buscar productos por el codigo de remito.

export const searchEntryByReceiptCode = async (req, res) => {
  try {
    const receiptCode = req.params.receipt_code
    const entry = await prisma.entry.findMany({
      where: {
        receiptCode: { contains: receiptCode.toLowerCase() }
      }
    })

    if (entry.length === 0) {
      return res.status(404).json({
        error: 'No se encontraron ingresos que coincidan con la busqueda.'
      })
    }
    return res.status(200).json(entry)
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudieron buscar los ingresos.'
    })
  }
}

// Funcion para buscar ingresos por compañia que envia.

export const searchEntryByDeliveryCompany = async (req, res) => {
  try {
    const deliveryCompany = req.params.delivery_company
    const entry = await prisma.entry.findMany({
      where: {
        deliveryCompany: { contains: deliveryCompany.toLowerCase() }
      }
    })

    if (entry.length === 0) {
      return res.status(404).json({
        error: 'No se encontraron ingresos que coincidan con la busqueda.'
      })
    }
    return res.status(200).json(entry)
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudieron buscar los ingresos.'
    })
  }
}

// Funcion pra buscar ingresos por fecha especifica.

export const searchEntryByDate = async (req, res) => {
  try {
    const entryDate = req.params.entry_date
    const entry = await prisma.entry.findMany({
      where: {
        entryDate: { equals: entryDate }
      }
    })

    if (entry.length === 0) {
      return res.status(404).json({
        error: 'No se encontraron ingresos que coincidan con la busqueda.'
      })
    }
    return res.status(200).json(entry)
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudieron buscar los ingresos.'
    })
  }
}

// Funcion para buscar ingresos por un rango de fechas

export const searchEntryByDateRange = async (req, res) => {
  try {
    const entryDateStart = req.body.entryDate_start
    const entryDateEnd = req.body.entryDate_end
    const entry = await prisma.entry.findMany({
      where: {
        entryDate: { gte: entryDateStart, lte: entryDateEnd }
      }
    })

    if (entry.length === 0) {
      return res.status(404).json({
        error: 'No se encontraron ingresos que coincidan con la busqueda.'
      })
    }
    return res.status(200).json(entry)
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudieron buscar los ingresos.'
    })
  }
}

// Funcion para buscar ingresos por el status del producto al ingresar.

export const searchEntryByStatus = async (req, res) => {
  try {
    const status = req.params.status
    const entry = await prisma.entry.findMany({
      where: {
        status: { equals: status.toLowerCase() }
      }
    })

    if (entry.length === 0) {
      return res.status(404).json({
        error: 'No se encontraron ingresos que coincidan con la busqueda.'
      })
    }
    return res.status(200).json(entry)
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudieron buscar los ingresos.'
    })
  }
}

// Funcion para buscar ingresos por el dni del admin.

export const searchEntryByAdmin = async (req, res) => {
  try {
    const adminId = parseInt(req.params.admin_id)
    const entry = await prisma.entry.findMany({
      where: {
        adminId: { equals: adminId }
      }
    })

    if (entry.length === 0) {
      return res.status(404).json({
        error: 'No se encontraron ingresos que coincidan con la busqueda.'
      })
    }
    return res.status(200).json(entry)
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudieron buscar los ingresos.'
    })
  }
}
