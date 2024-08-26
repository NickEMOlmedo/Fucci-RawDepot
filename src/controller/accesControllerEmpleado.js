import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
const { compareSync, hashSync } = bcryptjs

const secret = process.env.SECRET

const prisma = new PrismaClient()

// Verificar si el empleado existe y si no proceder a crearlo.

export const register = async (req, res) => {
  try {
    const { nombre, apellido, dni, contrasena, area, rol } = req.body
    const dniParser = parseInt(dni)
    let empleado = await prisma.empleado.findFirst({
      where: { dni: dniParser }
    })
    if (empleado) {
      throw new Error('¡El empleado ya existe!')
    }
    empleado = await prisma.empleado.create({
      data: {
        nombre,
        apellido,
        dni: dniParser,
        contrasena: hashSync(contrasena, 10),
        area,
        rol
      }
    })

    const empleadoReturn = {
      succes: true,
      message: '¡Empleado creado exitosamente!'
    }
    res.status(201).json(empleadoReturn)
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
    const { dni, contrasena } = req.body
    const dniParser = parseInt(dni)
    const empleado = await prisma.empleado.findFirst({
      where: { dni: dniParser }
    })
    const passwordOk =
      empleado === null
        ? false
        : await compareSync(contrasena, empleado.contrasena)
    if (!passwordOk) {
      res.status(401).json({ error: 'Usuario o clave incorrectos.' })
    }

    const token = jwt.sign(
      { id: empleado.id, empleado: empleado.nombre, area: empleado.area },
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
