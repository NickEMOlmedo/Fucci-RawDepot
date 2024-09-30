import prisma from '../libs/db'

// Funcion para ingresar un nuevo lote.

export const createLot = async (req, res) => {
  try {
    const lotNumberToCompare = req.body.lot_number
    const expirationDateToCompare = req.body.expiration_date
    const productIdToCompare = req.body.product_id

    const lotCompare = await prisma.lot.findFirst({
      where: {
        lotNumber: lotNumberToCompare.toLowerCase(),
        expirationDate: expirationDateToCompare.toLowerCase(),
        productId: parseInt(productIdToCompare)
      }
    })

    if (lotCompare) {
      return res.status(409).json({
        error:
          '¡Este lote ya existe para este producto, porfavor verifique los datos!'
      })
    }

    const { lotNumber, expirationDate, quantity, productId } = req.body

    const lot = await prisma.lot.create({
      data: {
        lotNumber: lotNumber.toLowerCase(),
        expirationDate,
        quantity: parseInt(quantity),
        productId: parseInt(productId)
      }
    })
    if (lot) {
      return res
        .status(201)
        .json({ message: '¡Usted ha cargado un nuevo lote exitosamente!' })
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Error en el servidor, no se pudo cargar el lote.' })
  }
}

// Funcion que muestra todos lotes.

export const getAllLots = async res => {
  try {
    const lot = await prisma.lot.findMany()
    if (lot) {
      return res.status(200).json(lot)
    }
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
        id: { id }
      }
    })

    if (lot) {
      return res.status(200).json(lot)
    } else {
      return res.status(404).json({ error: 'Lote no encontrado!' })
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Error en el servidor, no se pudo retornar el lote.' })
  }
}

// Funcion para modificar un lote.

export const updateLot = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const lotCompare = await prisma.lot.findUnique({ where: { id } })
    if (!lotCompare) {
      return res
        .status(409)
        .json({ error: '¡Este lote no existe, porfavor verifique los datos!' })
    }
    const { lotNumber, expirationDate, quantity, productId } = req.body
    const lot = await prisma.lot.update({
      data: {
        lotNumber,
        expirationDate,
        quantity,
        productId
      }
    })
    if (lot) {
      return res
        .status(201)
        .json({ message: '¡Usted ha cargado un nuevo lote exitosamente!' })
    }
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudo actualizar el lote.'
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
        .status(409)
        .send({ error: '¡Este lote no existe, porfavor verifique los datos!' })
    }

    const lot = await prisma.lot.delete({ where: { id } })
    if (lot) {
      return res.status(200).json({ message: '¡Lote eliminado exitosamente!' })
    }
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
        lotNumber: { lotNumber }
      }
    })

    if (entry.length === 0) {
      res.status(404).json({
        error: 'No se encontraron lotes que coincidan con la busqueda.'
      })
    }
    return res.status(200).json(entry)
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Error en el servidor, no se pudo buscar el lote.' })
  }
}

// Funcion para buscar un lote por su fecha de expiracion.

export const searchLotByExpirationDate = async (req, res) => {
  try {
    const expirationDate = req.params.expiration_date
    const entry = await prisma.lot.findMany({
      where: {
        expirationDate: { expirationDate }
      }
    })

    if (entry.length === 0) {
      res.status(404).json({
        error: 'No se encontraron lotes que coincidan con la busqueda.'
      })
    }
    return res.status(200).json(entry)
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Error en el servidor, no se pudieron buscar los lotes.' })
  }
}

// Funcion para buscar un lote por producto.

export const searchLotByProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.product_id)
    const entry = await prisma.lot.findMany({
      where: {
        productId: { productId }
      }
    })

    if (entry.length === 0) {
      res.status(404).json({
        error: 'No se encontraron lotes que coincidan con la busqueda.'
      })
    }
    return res.status(200).json(entry)
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Error en el servidor, no se pudieron buscar los lotes.' })
  }
}
