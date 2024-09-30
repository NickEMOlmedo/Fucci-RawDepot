import prisma from '../libs/db'

// Funcion que carga un nuevo ingreso de mercaderia.

export const createEntry = async (req, res) => {
  try {
    const productToCompare = req.body.producType
    const receiptCodeToCompare = req.body.receiptCode
    const deliveryCompanyToCompare = req.body.deliveryCompany

    const entryCompare = await prisma.entry.findFirst({
      where: {
        producType: productToCompare.toLowerCase(),
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
        entryDate: new Date(entryDate),
        quantity: quantity.toLowerCase(),
        status: status ? status.toLowerCase() : entryCompare.status,
        adminDni: parseInt(adminDni)
      }
    })

    if (entry) {
      return res
        .status(201)
        .json({ message: '¡Usted ha cargado un nuevo ingreso exitosamente!' })
    }
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
      res.status(404).json({ error: 'No existen ingresos para mostrar.' })
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
    const entry = prisma.entry.findUnique({ where: { id } })
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
      id: { id }
    })

    if (!entryCompare) {
      return res.status(409).json({
        error: '¡Este ingreso no existe, porfavor verifique los datos!'
      })
    }

    const {
      producType,
      receiptCode,
      deliveryCompany,
      entryDate,
      quantity,
      status
    } = req.body

    const entry = prisma.entry.update({
      where: { id },
      data: {
        productType: producType.toLowerCase(),
        receiptCode: receiptCode.toLowerCase(),
        deliveryCompany: deliveryCompany.toLowerCase(),
        entryDate: new Date(entryDate),
        quantity: quantity ? parseInt(quantity) : entryCompare.quantity,
        status: status ? status.toLowerCase() : entryCompare.status
      }
    })

    if (entry) {
      return res.status(201).json({
        message: '¡Usted ha actualizado el ingreso exitosamente!'
      })
    }
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
      id: { id }
    })

    if (!entryCompare) {
      return res.status(409).json({
        error: '¡Este ingreso no existe, porfavor verifique los datos!'
      })
    }

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
    return res.status(500).send({
      error: 'Error en el servidor, no se pudo eliminar el ingreso.'
    })
  }
}

// Funcion para buscar ingresos por tipo de producto.

export const searchEntryByProductType = async (req, res) => {
  try {
    const productType = req.params.product_type
    const entry = await prisma.entry.findMany({
      where: {
        producType: { contains: productType.toLowerCase() }
      }
    })

    if (entry.length === 0) {
      res.status(404).json({
        error: 'No se encontraron ingresos que coincidan con la busqueda.'
      })
    }
    return res.status(200).json(entry)
  } catch (error) {
    res.status(500).json({
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
      res.status(404).json({
        error: 'No se encontraron ingresos que coincidan con la busqueda.'
      })
    }
    return res.status(200).json(entry)
  } catch (error) {
    res.status(500).json({
      error: 'Error en el servidor, no se pudieron buscar los ingresos.'
    })
  }
}

// Funcion pra buscar ingresos por fecha .

export const searchEntryByDate = async (req, res) => {
  try {
    const entryDate = req.params.entry_date
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
    res.status(500).json({
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
        status: status.toLowerCase()
      }
    })

    if (entry.length === 0) {
      res.status(404).json({
        error: 'No se encontraron ingresos que coincidan con la busqueda.'
      })
    }
    return res.status(200).json(entry)
  } catch (error) {
    res.status(500).json({
      error: 'Error en el servidor, no se pudieron buscar los ingresos.'
    })
  }
}

// Funcion para buscar ingresos por el dni del admin.

export const searchEntryByAdmin = async (req, res) => {
  try {
    const adminDni = parseInt(req.params.admin_dni)
    const entry = await prisma.entry.findMany({
      where: {
        dni: parseInt(adminDni)
      }
    })

    if (entry.length === 0) {
      res.status(404).json({
        error: 'No se encontraron ingresos que coincidan con la busqueda.'
      })
    }
    return res.status(200).json(entry)
  } catch (error) {
    res.status(500).json({
      error: 'Error en el servidor, no se pudieron buscar los ingresos.'
    })
  }
}
