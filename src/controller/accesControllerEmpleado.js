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
    res.status(201).json(empleado)
  } catch (error) {
    res.status(400).send({ error: 'Porfavor verifique los datos.' })
  }
}

// Verificar si el empleado existe y realiza la comprobacion para ejecutar el login

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
      res.status(401).json({ error: 'Usuario o clave incorrectos|' })
    }

    const userToken = {
      id: empleado.id,
      username: empleado.nombre
    }

    const token = jwt.sign(userToken, secret)

    res.status(200).json({
      id: empleado.id,
      nombre: empleado.nombre,
      token
    })
  } catch (error) {
    console.error('Error en el servidor')
    res.status(500).json({ error: 'Error en el servidor.' })
  }
}
