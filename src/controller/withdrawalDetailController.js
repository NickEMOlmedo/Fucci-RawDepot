import prisma from '../libs/db.js'

// Funcion para cargar un nuevo detalle de retiro.

export const createWithdrawalDetail = async (req, res) => {
  try {
    const { withdrawalId, notes, products } = req.body

    const id = parseInt(withdrawalId)

    const existingDetail = await prisma.withdrawalDetail.findFirst({
      where: { withdrawalId: id }
    })

    if (existingDetail) {
      return res.status(400).json({
        error: 'Ya existe un detalle de retiro para este retiro.'
      })
    }

    const withdrawalDetail = await prisma.withdrawalDetail.create({
      data: {
        withdrawalId: parseInt(withdrawalId),
        notes: notes.toLowerCase()
      }
    })

    await prisma.withdrawalDetailProduct.createMany({
      data: products.map(product => ({
        withdrawalDetailId: parseInt(withdrawalDetail.id),
        productId: parseInt(product.productId),
        quantity: parseInt(product.quantity),
        status: product.status.toLowerCase()
      }))
    })

    await Promise.all(
      products.map(product => {
        return prisma.product.update({
          where: { id: parseInt(product.productId) },
          data: { stock: { decrement: parseInt(product.quantity) } }
        })
      })
    )

    return res
      .status(201)
      .json({ message: '¡Detalle de retiro creado exitosamente!' })
  } catch (error) {
    return res.status(500).json({
      error:
        'Error en el servidor, no se pudo cargar el detalle de retiro.' 
    })
  }
}

// Funcion que muestra todos los detalles de retiro.

export const getAllWithdrawalDetails = async (req, res) => {
  try {
    const withdrawalDetail = await prisma.withdrawalDetail.findMany({
      include: { withdrawalProducts: { include: { product: true } } }
    })

    if (withdrawalDetail.length === 0) {
      return res
        .status(404)
        .json({ error: 'No existen ingresos para mostrar.' })
    }
    return res.status(200).json(withdrawalDetail)
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
        id: id
      },
      include: { withdrawalProducts: { include: { product: true } } }
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
        'Error en el servidor, no se pudo obtener el detalle de retiro.' 
    })
  }
}

// Funcion para actualizar un detalle de retiro.

export const updateWithdrawalDetail = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const withdrawalDetailCompare = await prisma.withdrawalDetail.findUnique({
      where: { id: id }
    })
    if (!withdrawalDetailCompare) {
      return res.status(404).json({
        error:
          '¡Este detalle de retiro no existe, porfavor verifique los datos!'
      })
    }

    const { notes, products } = req.body
    await prisma.withdrawalDetail.update({
      where: { id: id },
      data: {
        notes: notes ? notes.toLowerCase() : withdrawalDetailCompare.notes
      }
    })

    await Promise.all(
      products.map(async product => {
        const existingProduct = await prisma.withdrawalDetailProduct.findFirst({
          where: {
            withdrawalDetailId: id,
            productId: parseInt(product.productId)
          }
        })

        console.log(existingProduct.id)

        if (existingProduct) {
          await prisma.withdrawalDetailProduct.update({
            where: { id: existingProduct.id },
            data: {
              quantity: product.quantity
                ? parseInt(product.quantity)
                : existingProduct.quantity,
              status: product.status
                ? product.status.toLowerCase()
                : existingProduct.status
            }
          })
        } else {
          await prisma.withdrawalDetailProduct.create({
            data: {
              withdrawalDetailId: parseInt(withdrawalDetailCompare.id),
              productId: parseInt(product.productId),
              quantity: parseInt(product.quantity),
              status: product.status.toLowerCase()
            }
          })
        }
      })
    )

    await Promise.all(
      products.map(product => {
        return prisma.product.update({
          where: { id: parseInt(product.productId) },
          data: { stock: { decrement: parseInt(product.quantity) } }
        })
      })
    )

    return res.status(200).json({
      message: '¡Detalle de retiro actualizado exitosamente!'
    })
  } catch (error) {
    return res.status(500).json({
      error:
        'Error en el servidor, no se pudo actualizar el detalle de retiro.' 
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
    await prisma.withdrawalDetailProduct.deleteMany({
      where: { withdrawalDetailId: id }
    })

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
    const status = req.params.status.toLowerCase()
    const withdrawalDetails = await prisma.withdrawalDetail.findMany({
      where: {
        withdrawalProducts: {
          some: {
            status: status.toLowerCase()
          }
        }
      },
      include: {
        withdrawalProducts: true
      }
    })

    // Aca filtramos los resultados de la consulta
    //para que devuelva los detalles de retiro que solo coincidan con la busqueda.

    const filteredDetails = withdrawalDetails.map(filter => ({
      ...filter,
      withdrawalProducts: filter.withdrawalProducts.filter(
        product => product.status.toLowerCase() === status
      )
    }))

    const filteringCheck = filteredDetails.some(
      detail => detail.withdrawalProducts.length > 0
    )

    if (filteringCheck) {
      return res.status(200).json(filteredDetails)
    } else {
      return res.status(404).json({
        error: '¡No se encontraron detalles de retiro con ese estado!'
      })
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
    const withdrawalDetails = await prisma.withdrawalDetail.findMany({
      where: {
        withdrawalProducts: {
          some: {
            productId: productId
          }
        }
      },
      include: {
        withdrawalProducts: true
      }
    })

    // Aca filtramos los resultados de la consulta
    //para que devuelva los detalles de retiro que solo coincidan con la busqueda.

    const filteredDetails = withdrawalDetails.map(filter => ({
      ...filter,
      withdrawalProducts: filter.withdrawalProducts.filter(
        product => product.productId === productId
      )
    }))

    const filteringCheck = filteredDetails.some(
      detail => detail.withdrawalProducts.length > 0
    )

    if (filteringCheck) {
      return res.status(200).json(filteredDetails)
    } else {
      return res.status(404).json({
        error: '¡No se encontraron detalles de retiro para ese producto!'
      })
    }
  } catch (error) {
    return res.status(500).json({
      error:
        'Error en el servidor, no se pudieron buscar los detalles de retiro.'
    })
  }
}
