import prisma from '../libs/db.js'

// Funcion para cargar un nuevo detalle de retiro.

export const createWithdrawalDetail = async (req, res) => {
  try {
    const idToCompare = parseInt(req.body.withdrawalId)
    const productIdToCompare = parseInt(req.body.productId)

    const withdrawalDetailToCompare = await prisma.withdrawalDetail.findFirst({
      where: {
        withdrawalId: { idToCompare },
        productId: { productIdToCompare }
      }
    })

    if (withdrawalDetailToCompare) {
      return res
        .status(409)
        .json({ error: '¡El detalle de retiro ingresado ya existe!' })
    }

    const { quantity, status, notes, withdrawalId, productId } = req.body

    const withdrawalDetail = await prisma.withdrawalDetail.create({
      data: {
        quantity: parseInt(quantity),
        status: status.toLowerCase(),
        notes: notes.toLowerCase(),
        withdrawalId: parseInt(withdrawalId),
        productId: parseInt(productId)
      }
    })

    if (withdrawalDetail) {
      return res
        .status(201)
        .json({ message: '¡Detalle de retiro creado exitosamente!' })
    }
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudo cargar el detalle de retiro.'
    })
  }
}

// Funcion que muestra todos los detalles de retiro.

export const getAllWithdrawalDetails = async res => {
  try {
    const withdrawalDetail = await prisma.withdrawalDetail.findMany()

    if (withdrawalDetail) {
      return res.status(200).json(withdrawalDetail)
    }
  } catch (error) {
    return res.status(500).json({
      error:
        'Error en el servidor, no se pudieron obtener los detalles de retiro.'
    })
  }
}

// Funcion para obtener un detalle de retiro a traves de su id.

export const getWithdrawalDetailWithId = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const withdrawalDetail = await prisma.withdrawalDetail.findUnique({
      where: {
        id: { id }
      }
    })

    if (withdrawalDetail) {
      return res.status(200).json(withdrawalDetail)
    } else {
      return res
        .status(404)
        .json({ error: '¡Detalle de retiro no encontrado!' })
    }
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudo obtener el detalle de retiro.'
    })
  }
}

// Funcion para actualizar un detalle de retiro.

export const updateWithdrawalDetail = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const withdrawalDetailCompare = await prisma.withdrawal.findUnique({
      where: { id }
    })
    if (!withdrawalDetailCompare) {
      return res.status(404).json({
        error:
          '¡Este detalle de retiro no existe, porfavor verifique los datos!'
      })
    }
    const { quantity, status, notes, withdrawalId, productId } = req.body
    const withdrawalDetail = await prisma.withdrawalDetail.update({
      data: {
        quantity: quantity
          ? parseInt(quantity)
          : withdrawalDetailCompare.quantity,
        status: status ? status.toLowerCase() : withdrawalDetailCompare.status,
        notes: notes ? notes.toLowerCase() : withdrawalDetailCompare.notes,
        withdrawalId: withdrawalId
          ? parseInt(withdrawalId)
          : withdrawalDetailCompare.withdrawalId,
        productId: productId
          ? parseInt(productId)
          : withdrawalDetailCompare.productId
      }
    })
    if (withdrawalDetail) {
      return res.status(201).json({
        message:
          '¡Usted ha actualizado un nuevo detalle de retiro exitosamente!'
      })
    }
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudo actualizar el detalle de retiro.'
    })
  }
}

// Funcion para poder eliminar un detalle de retiro.

export const deleteWithdrawalDetail = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const withdrawalDetailCompare = await prisma.withdrawalDetail.findUnique({
      where: { id }
    })
    if (!withdrawalDetailCompare) {
      return res.status(404).json({
        error:
          '¡Este detalle de retiro no existe, porfavor verifique los datos!'
      })
    }

    await prisma.withdrawalDetail.delete({ where: { id } })
    return res
      .status(200)
      .json({ message: '¡Detalle de retiro eliminado exitosamente!' })
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudo eliminar el detalle de retiro.'
    })
  }
}

// Funcion para obtener un detalle de retiro a traves de su status.

export const searchWithdrawalDetailWithStatus = async (req, res) => {
  try {
    const status = req.params.status
    const withdrawalDetail = await prisma.withdrawalDetail.findUnique({
      where: {
        status: { status }
      }
    })

    if (withdrawalDetail) {
      return res.status(200).json(withdrawalDetail)
    } else {
      return res
        .status(404)
        .json({ error: '¡Detalle de retiro no encontrado!' })
    }
  } catch (error) {
    return res.status(500).json({
      error:
        'Error en el servidor, no se pudieron buscar los detalles de retiro.'
    })
  }
}

// Funcion para obtener un detalle de retiro a traves de el id del producto.

export const searchWithdrawalDetailWithProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.product_id)
    const withdrawalDetail = await prisma.withdrawalDetail.findUnique({
      where: {
        productId: { productId }
      }
    })

    if (withdrawalDetail) {
      return res.status(200).json(withdrawalDetail)
    } else {
      return res
        .status(404)
        .json({ error: '¡Detalle de retiro no encontrado!' })
    }
  } catch (error) {
    return res.status(500).json({
      error:
        'Error en el servidor, no se pudieron buscar los detalles de retiro.'
    })
  }
}
