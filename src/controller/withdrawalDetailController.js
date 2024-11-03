import prisma from '../libs/db.js'

// Funcion para cargar un nuevo detalle de retiro.

export const createWithdrawalDetail = async (req, res) => {
  try {
    const { withdrawalId, notes, products } = req.body

    await prisma.$transaction(async tx => {
      const withdrawalDetail = await tx.withdrawalDetail.create({
        data: {
          withdrawalId: parseInt(withdrawalId),
          notes: notes ? notes.toLowerCase() : null
        }
      })

      for (const product of products) {
        const productId = parseInt(product.productId)
        const quantity = parseInt(product.quantity)
        const status = product.status
        const stockProduct = await tx.product.findUnique({
          where: { id: productId },
          include: { lots: { orderBy: { expirationDate: 'asc' } } }
        })
        console.log(stockProduct)
        // Manejo de lotes para disminuir el stock
        let remainingQuantity = quantity
        for (const lot of stockProduct.lots) {
          if (lot.quantity >= remainingQuantity) {
            await tx.lot.update({
              where: { id: lot.id },
              data: { quantity: { decrement: remainingQuantity } }
            })
            remainingQuantity = 0
            break
          } else {
            remainingQuantity -= lot.quantity
            await tx.lot.update({
              where: { id: lot.id },
              data: { quantity: 0 }
            })
          }
        }

        if (remainingQuantity === 0) {
          await tx.product.update({
            where: { id: productId },
            data: { stock: { decrement: quantity } }
          })
        } else {
          throw Object.assign(
            new Error({
              message: `No hay suficiente stock para el producto: ${
                stockProduct.name +
                ' ' +
                stockProduct.brand +
                ' ' +
                stockProduct.presentation
              }`
            }),
            { name: 'LotStockError' }
          )
        }

        await tx.withdrawalDetailProduct.create({
          data: {
            withdrawalDetailId: withdrawalDetail.id,
            productId: productId,
            quantity: quantity,
            status: status.toLowerCase()
          }
        })
      }
    })

    return res.status(201).json({ message: '¡Retiro registrado exitosamente!' })
  } catch (error) {
    if (error.name === 'LotStockError') {
      return res.status(400).json(error.message)
    }
    return res.status(500).json({
      error:
        'Error en el servidor, no se pudo cargar el detalle de retiro.' + error
    })
  }
}

// Funcion que muestra todos los detalles de retiro.

export const getAllWithdrawalDetails = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0
    const take = parseInt(req.query.take) || 10
    const withdrawalDetail = await prisma.withdrawalDetail.findMany({
      include: { withdrawalProducts: { include: { product: true } } },
      skip: skip,
      take: take
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
      error: 'Error en el servidor, no se pudo obtener el detalle de retiro.'
    })
  }
}

// Funcion para actualizar un detalle de retiro.

export const updateWithdrawalDetail = async (req, res) => {
  try {
    const { withdrawalDetailId } = req.params
    const { notes, products } = req.body

    const withdrawalDetail = await prisma.withdrawalDetail.findUnique({
      where: { id: parseInt(withdrawalDetailId) },
      include: { withdrawalProducts: true }
    })

    if (!withdrawalDetail) {
      return res
        .status(404)
        .json({ error: '¡Detalle de retiro no encontrado!' })
    }

    await prisma.$transaction(async tx => {
      await tx.withdrawalDetail.update({
        where: { id: parseInt(withdrawalDetailId) },
        data: { notes: notes ? notes.toLowerCase() : null }
      })

      for (const product of products) {
        const productId = parseInt(product.productId)
        const quantity = parseInt(product.quantity)
        const status = product.status

        const existingDetailProduct = withdrawalDetail.withdrawalProducts.find(
          p => p.productId === productId
        )

        const stockProduct = await tx.product.findUnique({
          where: { id: productId },
          include: { lots: { orderBy: { expirationDate: 'asc' } } }
        })

        let remainingQuantity = quantity

        // Manejo de lotes para disminuir el stock
        for (const lot of stockProduct.lots) {
          if (lot.quantity >= remainingQuantity) {
            await tx.lot.update({
              where: { id: lot.id },
              data: { quantity: { decrement: remainingQuantity } }
            })
            remainingQuantity = 0
            break
          } else {
            remainingQuantity -= lot.quantity
            await tx.lot.update({
              where: { id: lot.id },
              data: { quantity: 0 }
            })
          }
        }

        if (remainingQuantity > 0) {
          throw Object.assign(
            new Error({
              message: `No hay suficiente stock para el producto: ${
                stockProduct.name +
                ' ' +
                stockProduct.brand +
                ' ' +
                stockProduct.presentation
              }`
            }),
            { name: 'LotStockError' }
          )
        }

        //Actualizamos el detalle y si no lo creamos.
        if (existingDetailProduct) {
          await tx.withdrawalDetailProduct.update({
            where: { id: existingDetailProduct.id },
            data: { quantity: quantity, status: status.toLowerCase() }
          })
        } else {
          await tx.withdrawalDetailProduct.create({
            data: {
              withdrawalDetailId: withdrawalDetail.id,
              productId: productId,
              quantity: quantity,
              status: status.toLowerCase()
            }
          })
        }
      }
    })

    return res
      .status(200)
      .json({ message: '¡Detalle de retiro actualizado exitosam0ente!' })
  } catch (error) {
    if (error.name === 'LotStockError') {
      return res.status(400).json(error.message)
    }
    return res.status(500).json({
      error:
        'Error en el servidor, no se pudo actualizar el detalle de retiro.' +
        error
    })
  }
}

// Funcion para poder eliminar un detalle de retiro.

export const deleteWithdrawalDetail = async (req, res) => {
  try {
    const { withdrawalDetailId } = req.params
    const withdrawalDetail = await prisma.withdrawalDetail.findUnique({
      where: { id: parseInt(withdrawalDetailId) },
      include: { withdrawalProducts: true }
    })

    if (!withdrawalDetail) {
      return res
        .status(404)
        .json({ error: '¡Detalle de retiro no encontrado!' })
    }

    await prisma.$transaction(async tx => {
      for (const product of withdrawalDetail.withdrawalProducts) {
        const withdrawalDetailProduct =
          await tx.withdrawalDetailProduct.findUnique({
            where: { id: product.id },
            include: { product: { include: { lots: true } } }
          })

        if (withdrawalDetailProduct) {
          const quantityToRestore = withdrawalDetailProduct.quantity

          //Volvemos el stock del producto a su estado
          await tx.product.update({
            where: { id: withdrawalDetailProduct.productId },
            data: { stock: { increment: quantityToRestore } }
          })

          let remainingQuantity = quantityToRestore

          // Disminuir en los lotes disponibles
          for (const lot of withdrawalDetailProduct.product.lots) {
            if (lot.quantity >= remainingQuantity) {
              await tx.lot.update({
                where: { id: lot.id },
                data: { quantity: { increment: remainingQuantity } }
              })
              remainingQuantity = 0
              break
            } else {
              remainingQuantity -= lot.quantity
              await tx.lot.update({
                where: { id: lot.id },
                data: { quantity: { increment: lot.quantity } }
              })
            }
          }

          // Si queda cantidad remanente, significa que no hay suficientes lotes para restaurar
          if (remainingQuantity > 0) {
            throw Object.assign(
              new Error(
                `No se puede restaurar la cantidad completa del producto: ${withdrawalDetailProduct.product.name}`
              ),
              { name: 'LotRestoreError' }
            )
          }
        }
      }

      await tx.withdrawalDetail.delete({
        where: { id: parseInt(withdrawalDetailId) }
      })
    })

    return res
      .status(200)
      .json({ message: '¡Detalle de retiro eliminado exitosamente!' })
  } catch (error) {
    if (error.name === 'LotRestoreError') {
      return res.status(400).json(error.message)
    }
    return res.status(500).json({
      error:
        'Error en el servidor, no se pudo eliminar el detalle de retiro.' +
        error
    })
  }
}

// Funcion para obtener un detalle de retiro a traves de su status.

export const searchWithdrawalDetailWithStatus = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0
    const take = parseInt(req.query.take) || 10
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
      },
      skip: skip,
      take: take
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
    const skip = parseInt(req.query.skip) || 0
    const take = parseInt(req.query.take) || 10
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
      },
      skip: skip,
      take: take
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
