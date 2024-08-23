import { PrismaClient } from '@prisma/client/extension'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
const { compareSync, hashSync } = bcryptjs

const secret = process.env.SECRET

const prisma = new PrismaClient()

// Verificar si el empleado existe y si no proceder a crearlo.

export const register = async (req, res) => {
  const { nombre, apellido, dni, password, area, rol } = req.body
  let empleado = await prisma.empleado.findFirst({ where: { dni } })
  if (empleado) {
    throw new Error('¡El empleado ya existe!')
  }
  empleado = await prisma.empleado.create({
    data: {
      nombre,
      apellido,
      dni,
      contrasena: hashSync(password, 10),
      area,
      rol
    }
  })
  res.json(empleado)
}

// Verificar si el empleado existe y realiza la comprobacion para ejecutar el login

export const login = async (req, res) => {
  const { dni, password } = req.body
  const empleado = await prisma.empleado.findFirst({ where: { dni } })
  if (!empleado) {
    throw new Error('¡El empleado no existe!')
  }

  // Comparacion de la contraseña encriptada con la ingresada por el usuario para el login

  if (!compareSync(password, empleado.contrasena)) {
    throw new Error('¡Contraseña incorrecta!')
  }

  const token = jwt.sign(
    {
      empleadoDni: empleado.dni
    },
    secret
  )
  res.json({ empleado, token })
}
