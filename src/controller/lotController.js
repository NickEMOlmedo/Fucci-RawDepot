import prisma from '../libs/db.js'

// Funcion para ingresar un nuevo lote.

export const createLot = async (req, res) => {
  try {
    const { lotNumber, expirationDate, quantity, productId } = req.body
    const lot = await prisma.lot.create({
      data: {
        lotNumber: lotNumber.toLowerCase(),
        expirationDate: expirationDate,
        quantity: parseInt(quantity),
        productId: parseInt(productId)
      }
    })
    if (lot) {
      return res.status(201).json({ message: '¡Lote cargado exitosamente!' })
    }
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudo cargar el lote.'
    })
  }
}

// Funcion que muestra todos lotes.

export const getAllLots = async (req, res) => {
  try {
    const lot = await prisma.lot.findMany()
    if (lot.length === 0) {
      return res.status(404).json({ error: 'No existen lotes para mostrar.' })
    }
    return res.status(200).json(lot)
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudieron obtener los lotes.'
    })
  }
}

// Funcion que retorna un lote segun el id.

export const getLotById = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const lot = await prisma.lot.findUnique({
      where: {
        id: id
      }
    })

    if (lot) {
      return res.status(200).json(lot)
    } else {
      return res.status(404).json({ error: '¡Lote no encontrado!' })
    }
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudo retornar el lote.'
    })
  }
}

// Funcion para modificar un lote.

export const updateLot = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const lotCompare = await prisma.lot.findUnique({ where: { id } })
    if (!lotCompare) {
      return res
        .status(404)
        .json({ error: '¡Este lote no existe, porfavor verifique los datos!' })
    }
    const { lotNumber, expirationDate, quantity, productId } = req.body
    const lot = await prisma.lot.update({
      where: { id: id },
      data: {
        lotNumber: lotNumber ? lotNumber.toLowerCase() : lotCompare.lotNumber,
        expirationDate: expirationDate
          ? expirationDate
          : lotCompare.expirationDate,
        quantity: quantity ? parseInt(quantity) : lotCompare.quantity,
        productId: productId ? parseInt(productId) : lotCompare.productId
      }
    })
    if (lot) {
      return res.status(201).json({ message: '¡Lote modificado exitosamente!' })
    }
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudo actualizar el lote.' + error
    })
  }
}

// Funcion para poder eliminar un lote.

export const deleteLot = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const lotCompare = await prisma.lot.findUnique({ where: { id } })
    if (!lotCompare) {
      return res
        .status(404)
        .json({ error: '¡Este lote no existe, porfavor verifique los datos!' })
    }

    await prisma.lot.delete({ where: { id } })
    return res.status(200).json({ message: '¡Lote eliminado exitosamente!' })
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudo eliminar el lote.'
    })
  }
}

// Funcion para buscar un lote por su numero de lote.

export const searchLotByNum = async (req, res) => {
  try {
    const lotNumber = req.params.lot_number
    const entry = await prisma.lot.findMany({
      where: {
        lotNumber: { contains: lotNumber.toLowerCase() }
      }
    })

    if (entry.length === 0) {
      return res.status(404).json({
        error: 'No se encontraron lotes que coincidan con la busqueda.'
      })
    }
    return res.status(200).json(entry)
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudo buscar el lote.'
    })
  }
}

// Funcion para buscar un lote por su fecha de expiracion.

export const searchLotByExpirationDate = async (req, res) => {
  try {
    const expirationDate = req.params.expiration_date
    const entry = await prisma.lot.findMany({
      where: {
        expirationDate: { equals: expirationDate }
      }
    })

    if (entry.length === 0) {
      return res.status(404).json({
        error: 'No se encontraron lotes que coincidan con la busqueda.'
      })
    }
    return res.status(200).json(entry)
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudieron buscar los lotes.'
    })
  }
}

//Funcion para buscar un lote por su fecha de vencimiento a traves de un rango.

export const searchLotByExpirationDateRange = async (req, res) => {
  try {
    const lotExpirationDateStart = req.body.expiracionDate_start
    const lotExpirationDateEnd = req.body.expirationDate_end
    const entry = await prisma.lot.findMany({
      where: {
        expirationDate: {
          gte: lotExpirationDateStart,
          lte: lotExpirationDateEnd
        }
      }
    })

    if (entry.length === 0) {
      return res.status(404).json({
        error: 'No se encontraron lotes que coincidan con la busqueda.'
      })
    }
    return res.status(200).json(entry)
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudieron buscar los lotes.'
    })
  }
}

// Funcion para buscar un lote por producto.

export const searchLotByProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.product_id)
    const entry = await prisma.lot.findMany({
      where: {
        productId: { equals: productId }
      }
    })

    if (entry.length === 0) {
      return res.status(404).json({
        error: 'No se encontraron lotes que coincidan con la busqueda.'
      })
    }
    return res.status(200).json(entry)
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Error en el servidor, no se pudieron buscar los lotes.' })
  }
}

// Funcion para verificar si existe un mismo lote y fecha para un producto,
//esto advierte al usuario para que tome la decision correspondiente.

export const comprobationHandler = async (req, res) => {
  try {
    const lotNumberToCompare = req.body.lotNumber
    const productIdToCompare = req.body.productId
    const expirationDateToCompare = req.body.expirationDate

    const lotCompare = await prisma.lot.findFirst({
      where: {
        lotNumber: lotNumberToCompare.toLowerCase(),
        productId: parseInt(productIdToCompare),
        expirationDate: expirationDateToCompare
      }
    })

    if (lotCompare) {
      return res.status(200).json({
        message:
          '¡El lote de ese producto ya existe con esa misma fecha! ¿Desea cargarlo igualmente?.'
      })
    }

    return res.status(200).json({
      message: 'El lote no existe. Puede continuar con la carga.',
      exists: false
    })
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Error en el servidor, no se pudo comprobar el lote.' })
  }
}
