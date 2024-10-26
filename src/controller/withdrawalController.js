import prisma from '../libs/db.js'

// Funcion para cargar un nuevo retiro.

export const createWithdrawal = async (req, res) => {
  try {
    const { employeeId, adminId } = req.body
    const today = new Date()

    await prisma.withdrawal.create({
      data: {
        withdrawalDate: today,
        employeeId: parseInt(employeeId),
        adminId: parseInt(adminId)
      }
    })

    return res.status(201).json({ message: '¡Retiro cargado exitosamente!' })
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudo cargar el retiro.' 
    })
  }
}

// Funcion que devuelve todos los retiros.

export const getAllWithdrawals = async (req, res) => {
  try {
    const withdrawal = await prisma.withdrawal.findMany()
    if (withdrawal.length === 0) {
      return res
        .status(404)
        .json({ error: 'No existen ingresos para mostrar.' })
    }
    return res.status(200).json(withdrawal)
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudieron obtener los retiros.'
    })
  }
}

// Funcion que retorna un retiro segun el id.

export const getWithdrawalById = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const withdrawal = await prisma.withdrawal.findUnique({
      where: {
        id: id
      }
    })

    if (withdrawal) {
      return res.status(200).json(withdrawal)
    } else {
      return res.status(404).json({ error: 'Retiro no encontrado!' })
    }
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudo retornar el retiro.'
    })
  }
}

// Funcion para modificar un retiro.

export const updateWithdrawal = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const withdrawalCompare = await prisma.withdrawal.findUnique({
      where: { id }
    })
    if (!withdrawalCompare) {
      return res.status(409).json({
        error: '¡Este retiro no existe, porfavor verifique los datos!'
      })
    }
    const { employeeId, adminId } = req.body
    await prisma.withdrawal.update({
      where: { id: id },
      data: {
        employeeId: employeeId
          ? parseInt(employeeId)
          : withdrawalCompare.employeeId,
        adminId: adminId ? parseInt(adminId) : withdrawalCompare.adminId
      }
    })

    return res
      .status(201)
      .json({ message: '¡Retiro actualizado exitosamente!' })
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudo actualizar el retiro.'
    })
  }
}

// Funcion para poder eliminar un retiro.

export const deleteWithdrawal = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const withdrawalCompare = await prisma.withdrawal.findUnique({
      where: { id }
    })
    if (!withdrawalCompare) {
      return res.status(404).json({
        error: '¡Este retiro no existe, porfavor verifique los datos!'
      })
    }

    await prisma.withdrawal.delete({ where: { id } })
    return res.status(200).json({ message: '¡Retiro eliminado exitosamente!' })
  } catch (error) {
    if (error.code === 'P2003') {
      return res.status(409).json({
        error:
          '¡No se puede eliminar retiro porque hay un detalle de retiro relacionado!'
      })
    }
    return res.status(500).json({
      error: 'Error en el servidor, no se pudo eliminar el retiro.'
    })
  }
}

// Funcion para buscar un retiro por la fecha del retiro.

export const searchWithdrawalByDate = async (req, res) => {
  try {
    const withdrawalDate = new Date(req.params.withdrawal_date)
    const withdrawal = await prisma.withdrawal.findMany({
      where: {
        withdrawalDate: withdrawalDate
      }
    })

    if (withdrawal.length === 0) {
      return res.status(404).json({
        error: 'No se encontraron retiros que coincidan con la busqueda.'
      })
    }
    return res.status(200).json(withdrawal)
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudieron buscar los retiros.'
    })
  }
}

// Funcion para buscar retiros por un rango de fechas

export const searchWithdrawalByDateRange = async (req, res) => {
  try {
    const { withdrawalDate_start, withdrawalDate_end } = req.body

    const withdrawalDateStart = new Date(withdrawalDate_start)
    const withdrawalDateEnd = new Date(withdrawalDate_end)

    const entry = await prisma.entry.findMany({
      where: {
        entryDate: { gte: withdrawalDateStart, lte: withdrawalDateEnd }
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
      error: 'Error en el servidor, no se pudieron buscar los retiros.'
    })
  }
}

// Funcion para buscar un retiro por empleado.

export const searchWithdrawalByEmployee = async (req, res) => {
  try {
    const employeeId = parseInt(req.params.employee_id)
    const withdrawal = await prisma.withdrawal.findMany({
      where: {
        employeeId: { equals: employeeId }
      }
    })

    if (withdrawal.length === 0) {
      return res.status(404).json({
        error: 'No se encontraron retiros que coincidan con la busqueda.'
      })
    }
    return res.status(200).json(withdrawal)
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudieron buscar los retiros.'
    })
  }
}

// Funcion para buscar un retiro por administrador.

export const searchWithdrawalByAdmin = async (req, res) => {
  try {
    const adminId = parseInt(req.params.admin_id)
    const withdrawal = await prisma.withdrawal.findMany({
      where: {
        adminId: { equals: adminId }
      }
    })

    if (withdrawal.length === 0) {
      return res.status(404).json({
        error: 'No se encontraron retiros que coincidan con la busqueda.'
      })
    }
    return res.status(200).json(withdrawal)
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudieron buscar los retiros.'
    })
  }
}
