import prisma from '../libs/db.js'

// Funcion para cargar un nuevo retiro.

export const createWithdrawal = async (req, res) => {
  try {
    const { withdrawalDate, employeeDni, adminDni } = req.body
    const withdrawal = await prisma.withdrawal.create({
      data: {
        withdrawalDate,
        employeeDni: parseInt(employeeDni),
        adminDni: parseInt(adminDni)
      }
    })
    if (withdrawal) {
      return res
        .status(201)
        .json({ message: '¡Usted ha cargado un nuevo retiro exitosamente!' })
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Error en el servidor, no se pudo cargar el retiro.' })
  }
}

// Funcion que devuelve todos los retiros.

export const getAllWithdrawals = async res => {
  try {
    const withdrawal = await prisma.withdrawal.findMany()
    if (withdrawal) {
      return res.status(200).json(withdrawal)
    }
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
        id: { id }
      }
    })

    if (withdrawal) {
      return res.status(200).json(withdrawal)
    } else {
      return res.status(404).json({ error: 'Retiro no encontrado!' })
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Error en el servidor, no se pudo retornar el retiro.' })
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
    const { withdrawalDate, employeeDni, adminDni } = req.body
    const withdrawal = await prisma.withdrawal.update({
      data: {
        withdrawalDate,
        employeeDni: employeeDni
          ? parseInt(employeeDni)
          : withdrawalCompare.employeeDni,
        adminDni: adminDni ? parseInt(adminDni) : withdrawalCompare.adminDni
      }
    })
    if (withdrawal) {
      return res.status(201).json({
        message: '¡Usted ha actualizado un nuevo retiro exitosamente!'
      })
    }
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
      return res.status(409).send({
        error: '¡Este retiro no existe, porfavor verifique los datos!'
      })
    }

    const withdrawal = await prisma.withdrawal.delete({ where: { id } })
    if (withdrawal) {
      return res.status(200).json({ message: 'Retiro eliminado exitosamente!' })
    }
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudo eliminar el retiro.'
    })
  }
}

// Funcion para buscar un retiro por la fecha del retiro.

export const searchWithdrawalWithDate = async (req, res) => {
  try {
    const withdrawalDate = parseInt(req.params.withdrawal_date)
    const withdrawal = await prisma.withdrawal.findMany({
      where: {
        withdrawalDate: { withdrawalDate }
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

// Funcion para buscar un retiro por empleado.

export const searchWithdrawalWithEmployee = async (req, res) => {
  try {
    const employeeDni = parseInt(req.params.employee_dni)
    const withdrawal = await prisma.withdrawal.findMany({
      where: {
        employeeDni: { employeeDni }
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

export const searchWithdrawalWithAdmin = async (req, res) => {
  try {
    const adminDni = parseInt(req.params.admin_dni)
    const withdrawal = await prisma.withdrawal.findMany({
      where: {
        adminDni: { adminDni }
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
