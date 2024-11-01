import prisma from '../libs/db.js'

// Funcion que carga un nuevo ingreso de mercaderia.

export const createEntry = async (req, res) => {
  try {
    const {
      productId,
      receiptCode,
      deliveryCompany,
      quantity,
      lotNumber,
      expirationDate,
      status,
      adminId
    } = req.body

    const today = new Date()
    const expDate = new Date(expirationDate)

    // Verificar si el ingreso ya existe
    const entryExists = await prisma.entry.findFirst({
      where: {
        productId: parseInt(productId),
        receiptCode: receiptCode.toLowerCase(),
        deliveryCompany: deliveryCompany.toLowerCase()
      }
    })

    if (entryExists) {
      return res.status(409).json({
        error: '¡Este ingreso ya existe, por favor verifique los datos!'
      })
    }

    await prisma.$transaction(async tx => {
      const lot = await tx.lot.create({
        data: {
          lotNumber: lotNumber.toLowerCase(),
          expirationDate: expDate,
          quantity: parseInt(quantity),
          productId: parseInt(productId)
        }
      })

      await tx.entry.create({
        data: {
          productId: parseInt(productId),
          receiptCode: receiptCode.toLowerCase(),
          deliveryCompany: deliveryCompany.toLowerCase(),
          entryDate: today,
          lotId: lot.id,
          quantity: parseInt(quantity),
          status: status ? status.toLowerCase() : 'pendiente',
          adminId: parseInt(adminId)
        }
      })

      await tx.product.update({
        where: { id: parseInt(productId) },
        data: { stock: { increment: parseInt(quantity) } }
      })
    })

    return res
      .status(201)
      .json({ message: '¡Ingreso registrado exitosamente!' })
  } catch (error) {
    return res.status(500).json({
      message: 'Error en el servidor, no se pudo cargar el ingreso.' + error
    })
  }
}

// Funcion que muestra todos los ingresos disponibles.

export const getAllEntrys = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0
    const take = parseInt(req.query.take) || 10
    const entry = await prisma.entry.findMany({ skip: skip, take: take })
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
      where: { id },
      include: { lot: true }
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
      quantity,
      status,
      lotNumber,
      expirationDate
    } = req.body

    const newProductId = productId
      ? parseInt(productId)
      : entryCompare.productId
    const newQuantity = quantity ? parseInt(quantity) : entryCompare.quantity

    await prisma.$transaction(async tx => {
      //Aca actualizamoas el stock dependiendo de cambios en producto o cantidad.
      if (parseInt(newProductId) !== entryCompare.productId) {
        await tx.product.update({
          where: { id: entryCompare.productId },
          data: { stock: { decrement: entryCompare.quantity } }
        })

        await tx.product.update({
          where: { id: newProductId },
          data: { stock: { increment: parseInt(newQuantity) } }
        })
      } else if (parseInt(newQuantity) !== entryCompare.quantity) {
        const stockAdjust = parseInt(newQuantity) - entryCompare.quantity
        await tx.product.update({
          where: { id: parseInt(newProductId) },
          data: { stock: { increment: parseInt(stockAdjust) } }
        })
      }
      const lot = await tx.lot.update({
        where: { id: entryCompare.lot.id },
        data: {
          lotNumber: lotNumber
            ? lotNumber.toLowerCase()
            : entryCompare.lot.lotNumber,
          expirationDate: expirationDate
            ? new Date(expirationDate)
            : entryCompare.lot.expirationDate,
          quantity: newQuantity,
          productId: newProductId
        }
      })

      await tx.entry.update({
        where: { id },
        data: {
          productId: newProductId,
          receiptCode: receiptCode
            ? receiptCode.toLowerCase()
            : entryCompare.receiptCode,
          deliveryCompany: deliveryCompany
            ? deliveryCompany.toLowerCase()
            : entryCompare.deliveryCompany,
          lotId: lot.id ? parseInt(lot.id) : entryCompare.lotId,
          quantity: newQuantity,
          status: status ? status.toLowerCase() : entryCompare.status
        }
      })
    })
    return res.status(201).json({
      message: '¡Ingreso actualizado exitosamente!'
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudo actualizar el ingreso.' + error
    })
  }
}

export const deleteEntry = async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    // Verificar si la entrada existe
    const entryCompare = await prisma.entry.findUnique({
      where: { id },
      include: { lot: true }
    })

    if (!entryCompare) {
      return res.status(404).json({
        error: '¡Esta entrada no existe, por favor verifique los datos!'
      })
    }

    await prisma.$transaction(async tx => {
      await tx.product.update({
        where: { id: entryCompare.productId },
        data: { stock: { decrement: entryCompare.quantity } }
      })

      await tx.entry.delete({
        where: { id }
      })

      const lot = entryCompare.lot
      if (lot !== undefined || lote !== null) {
        await tx.lot.delete({
          where: { id: lot.id }
        })
      }
    })

    return res.status(200).json({
      message: 'Ingreso eliminado exitosamente!'
    })
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
    const skip = parseInt(req.query.skip) || 0
    const take = parseInt(req.query.take) || 10
    const deliveryCompany = req.params.delivery_company
    const entry = await prisma.entry.findMany({
      where: {
        deliveryCompany: { contains: deliveryCompany.toLowerCase() }
      },
      skip: skip,
      take: take
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
    const skip = parseInt(req.query.skip) || 0
    const take = parseInt(req.query.take) || 10
    const entryDate = new Date(req.params.entry_date)
    const entry = await prisma.entry.findMany({
      where: {
        entryDate: entryDate
      },
      skip: skip,
      take: take
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
    const skip = parseInt(req.query.skip) || 0
    const take = parseInt(req.query.take) || 10
    const { entryDate_start, entryDate_end } = req.body
    const entryDateStart = new Date(entryDate_start)
    const entryDateEnd = new Date(entryDate_end)
    const entry = await prisma.entry.findMany({
      where: {
        entryDate: { gte: entryDateStart, lte: entryDateEnd }
      },
      skip: skip,
      take: take
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
    const skip = parseInt(req.query.skip) || 0
    const take = parseInt(req.query.take) || 10
    const status = req.params.status
    const entry = await prisma.entry.findMany({
      where: {
        status: { equals: status.toLowerCase() }
      },
      skip: skip,
      take: take
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
    const skip = parseInt(req.query.skip) || 0
    const take = parseInt(req.query.take) || 10
    const adminId = parseInt(req.params.admin_id)
    const entry = await prisma.entry.findMany({
      where: {
        adminId: { equals: adminId }
      },
      skip: skip,
      take: take
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
