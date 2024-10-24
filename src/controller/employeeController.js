import prisma from '../libs/db.js'
import pkg from 'bcryptjs'
import jwt from 'jsonwebtoken'

const { compareSync, hashSync } = pkg

const secret = process.env.SECRET

// Funcion para crear un nuevo empleado.

export const createEmployee = async (req, res) => {
  try {
    const dni = parseInt(req.body.dni)
    const { firstName, lastName, password, area, role } = req.body
    let employee = await prisma.employee.findUnique({
      where: { dni }
    })

    // Verificar si el empleado existe y si no proceder a crearlo.

    if (employee) {
      return res.status(409).json('¡El empleado ya existe!')
    }
    employee = await prisma.employee.create({
      data: {
        firstName: firstName.toLowerCase(),
        lastName: lastName.toLowerCase(),
        dni: parseInt(dni),
        password: hashSync(password, 10),
        area: area.toLowerCase(),
        role: role.toLowerCase()
      }
    })

    return res.status(201).json({ message: '¡Empleado creado exitosamente!' })
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudo registrar el empleado.'
    })
  }
}

// Verificar si el empleado existe y realiza la comprobacion para ejecutar el login.

export const loginEmployee = async (req, res) => {
  try {
    const { dni, password } = req.body
    const dniParser = parseInt(dni)
    const employee = await prisma.employee.findUnique({
      where: { dni: dniParser }
    })
    const passwordOk =
      employee === null ? false : await compareSync(password, employee.password)
    if (!passwordOk) {
      return res.status(401).json({ error: 'Usuario o clave incorrectos.' })
    }

    const token = jwt.sign(
      {
        id: employee.id,
        acces: 'employee'
      },
      secret,
      { expiresIn: '30min' }
    )

    // Adicion de medidas de seguridad para la cookie que contiene el token.

    return res
      .status(200)
      .cookie('acces_token', token, {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
      })
      .json({
        message: '¡Bienvenido, has iniciado sesion exitosamente! '
      })
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor,  login fallido.'
    })
  }
}

// Funcion que devuelve todos los empleados.

export const getAllEmployees = async (req, res) => {
  try {
    const employee = await prisma.employee.findMany()
    if (employee.length === 0) {
      res.status(404).json({ error: 'No existen empleados para mostrar.' })
    }
    return res.status(200).json(
      employee.map(({ id, firstName, lastName, dni, area, role }) => ({
        id,
        firstName,
        lastName,
        dni,
        area,
        role
      }))
    )
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudieron retornar los empleados.'
    })
  }
}

// Funcion que retorna un empleado segun el dni.

export const getEmployeeByDni = async (req, res) => {
  try {
    const dni = parseInt(req.params.dni)
    const employee = await prisma.employee.findUnique({
      where: { dni }
    })

    if (employee) {
      return res.status(200).json({
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        area: employee.area,
        role: employee.role
      })
    } else {
      return res.status(404).json({ error: '¡Empleado no encontrado!' })
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Error en el servidor, no se pudo retornar el empleado' })
  }
}

// Funcion que retorna un empleado segun el id.

export const getEmployeeById = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const employee = await prisma.employee.findUnique({
      where: { id }
    })

    if (employee) {
      return res.status(200).json({
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        area: employee.area,
        role: employee.role
      })
    } else {
      return res.status(404).json({ error: 'Empleado no encontrado!' })
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Error en el servidor, no se pudo retornar el empleado' })
  }
}

// Funcion para eliminar un empleado segun el dni.

export const deleteEmployee = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const verifyEmployee = prisma.employee.findUnique({
      where: {
        id
      }
    })
    if (!verifyEmployee) {
      return res
        .status(404)
        .json({ error: '¡El empleado no existe, verifique los datos!' })
    }

    await prisma.employee.delete({
      where: {
        id
      }
    })

    return res
      .status(200)
      .json({ message: '¡El empleado ha sido eliminado exitosamente!' })
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudo eliminar al empleado.'
    })
  }
}

// Funcion para actualizar un empleado segun el dni.

export const updateEmployee = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const verifyEmployee = await prisma.employee.findUnique({
      where: {
        id
      }
    })

    if (!verifyEmployee) {
      return res
        .status(404)
        .json({ error: '¡El empleado no existe, verifique los datos!' })
    }

    const { firstName, lastName, dni, password, area, role } = req.body

    const existingDni = await prisma.employee.findUnique({
      where: { dni: parseInt(dni) }
    })

    if (existingDni) {
      if (
        dni &&
        dni !== verifyEmployee.dni &&
        existingDni.id !== verifyEmployee.id
      ) {
        return res.status(409).json({
          error:
            '¡El DNI ya está en uso por otro empleado ingrese uno diferente!'
        })
      }
    }

    const employee = await prisma.employee.update({
      where: {
        id
      },
      data: {
        firstName: firstName
          ? firstName.toLowerCase()
          : verifyEmployee.firstName,
        lastName: lastName ? lastName.toLowerCase() : verifyEmployee.lastName,
        dni: dni ? parseInt(dni) : verifyEmployee.dni,
        ...(password && { password: hashSync(password, 10) }),
        area: area ? area.toLowerCase() : verifyEmployee.area,
        role: role ? role.toLowerCase() : verifyEmployee.role
      }
    })

    if (employee) {
      return res
        .status(201)
        .json({ message: '¡Empleado actualizado exitosamente!' })
    }
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudo actualizar al empleado.'
    })
  }
}
