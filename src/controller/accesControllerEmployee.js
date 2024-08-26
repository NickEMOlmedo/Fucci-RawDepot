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
    let employee = await prisma.employee.findFirst({
      where: { dni: dniParser }
    })
    if (employee) {
      throw new Error('¡El empleado ya existe!')
    }
    employee = await prisma.employee.create({
      data: {
        firstName,
        lastName,
        dni: dniParser,
        password: hashSync(password, 10),
        area,
        role
      }
    })

    res
      .status(201)
      .json({ succes: true, message: '¡Empleado creado Exitosamente!' })
  } catch (error) {
    if (error.isValidationError) {
      res.status(400).send({ error: 'Porfavor verifique los datos.' })
    } else {
      res.status(500).send({ error: 'Error en el servidor.' })
    }
  }
}

// Verificar si el empleado existe y realiza la comprobacion para ejecutar el login.

export const login = async (req, res) => {
  try {
    const { dni, password } = req.body
    const dniParser = parseInt(dni)
    const employee = await prisma.employee.findFirst({
      where: { dni: dniParser }
    })
    const passwordOk =
      employee === null
        ? false
        : await compareSync(password, employee.contrasena)
    if (!passwordOk) {
      res.status(401).json({ error: 'Usuario o clave incorrectos.' })
    }

    const token = jwt.sign(
      { id: employee.id, empleado: employee.nombre, area: employee.area },
      secret,
      { expiresIn: '15min' }
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
    if (error.isValidationError) {
      res.status(400).send({ error: 'Porfavor verifique los datos.' })
    } else {
      res.status(500).send({ error: 'Error en el servidor.' })
    }
  }
}
