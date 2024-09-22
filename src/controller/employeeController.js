import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
const { compareSync, hashSync } = bcryptjs

const secret = process.env.SECRET

const prisma = new PrismaClient()

// Verificar si el empleado existe y si no proceder a crearlo.

export const register = async (req, res) => {
  try {
    const { firstName, lastName, dni, password, area, role } = req.body
    const dniParser = parseInt(dni)
    let employee = await prisma.employee.findUnique({
      where: { dni: dniParser }
    })
    if (employee) {
      res.status(409).json('¡El empleado ya existe!')
    }
    employee = await prisma.employee.create({
      data: {
        firstName: firstName.toLowerCasee(),
        lastName: lastName.toLowerCasee(),
        dni: dniParser,
        password: hashSync(password, 10),
        area: area.toLowerCasee(),
        role: role.toLowerCasee()
      }
    })

    res
      .status(201)
      .json({ succes: true, message: '¡Empleado creado exitosamente!' })
  } catch (error) {
    if (error.status === 400) {
      res.status(400).json({ error: 'Porfavor verifique los datos.' })
    } else {
      res.status(500).json({
        error: 'Error en el servidor, no se pudo registrar el empleado.'
      })
    }
  }
}

// Verificar si el empleado existe y realiza la comprobacion para ejecutar el login.

export const login = async (req, res) => {
  try {
    const { dni, password } = req.body
    const dniParser = parseInt(dni)
    const employee = await prisma.employee.findUnique({
      where: { dni: dniParser }
    })
    const passwordOk =
      employee === null ? false : await compareSync(password, employee.password)
    if (!passwordOk) {
      res.status(401).json({ error: 'Usuario o clave incorrectos.' })
    }

    const token = jwt.sign(
      {
        id: employee.id,
        empleado: employee.firstName,
        area: employee.area,
        role: employee.role,
        acces: 'employee'
      },
      secret,
      { expiresIn: '30min' }
    )

    // Adicion de medidas de seguridad para la cookie que contiene el token.

    res
      .status(200)
      .cookie('acces_token', token, {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
      })
      .json({
        succes: true,
        message: '¡Bienvenido, has iniciado sesion exitosamente! '
      })
  } catch (error) {
    if (error.status === 400) {
      res.status(400).json({ error: 'Porfavor verifique los datos.' })
    } else {
      res.status(500).json({
        error: 'Error en el servidor, no se pudo loguear al empleado.'
      })
    }
  }
}

// Funcion que retorna un empleado segun el dni.

export const getEmployee = async (req, res) => {
  try {
    const dni = parseInt(req.params.dni)

    const employee = await prisma.employee.findUnique({
      where: { dni: { dni } }
    })

    if (employee) {
      return res.status(200).json(employee)
    } else {
      return res.status(404).json({ error: 'Empleado no encontrado!' })
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Error en el servidor, no se pudo retornar el empleado' })
  }
}

// Funcion para eliminar un empleado segun el dni.

export const deleteEmployee = async (req, res) => {
  try {
    const dni = req.params.dni
    const verifyEmployee = prisma.employee.findUnique({
      where: {
        dni: { dni }
      }
    })
    if (!verifyEmployee) {
      return res
        .status(404)
        .json({ error: '¡El empleado no existe, verifique los datos!' })
    }

    const employee = await prisma.employee.delete({
      where: {
        dni: { dni }
      }
    })
    if (employee) {
      return res
        .status(200)
        .json({ message: '¡El empleado ha sido eliminado satisfactoriamente!' })
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Error en el servidor, no se pudo eliminar al empleado.' })
  }
}

// Funcion para actualizar un empleado segun el dni.

export const updateEmployee = async (req, res) => {
  try {
    const dni = req.params.dni
    const verifyEmployee = prisma.employee.findUnique({
      where: {
        dni: { dni }
      }
    })
    if (!verifyEmployee) {
      return res
        .status(404)
        .json({ error: '¡El empleado no existe, verifique los datos!' })
    }
    const { firstName, lastName, password, area, role } = req.body
    const employee = await prisma.employee.update({
      where: {
        dni,
        data: {
          firstName: firstName.toLowerCasee(),
          lastName: lastName.toLowerCasee(),
          password: hashSync(password, 10),
          area: area.toLowerCasee(),
          role: role.toLowerCasee()
        }
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
