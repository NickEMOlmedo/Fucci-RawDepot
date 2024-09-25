import { PrismaClient } from '@prisma/client'
import pkg from 'bcryptjs'
import jwt from 'jsonwebtoken'

const { compareSync, hashSync } = pkg

const secret = process.env.SECRET

const prisma = new PrismaClient()

// Funcion para crear un nuevo usuario administrador.

export const createAdmin = async (req, res) => {
  try {
    console.log(req.body)
    const { firstName, lastName, dni, email, password } = req.body

    const verifyAdmin = await prisma.admin.findUnique({ where: { dni } })

    // Verificar si el administrador existe si no procedemos a crearlo.

    if (verifyAdmin) {
      return res
        .status(409)
        .json({ error: '¡El administrador ya existe, verifique los datos!' })
    }

    const admin = await prisma.admin.create({
      data: {
        firstName: firstName.toLowerCase(),
        lastName: lastName.toLowerCase(),
        dni: parseInt(dni),
        email: email.toLowerCase(),
        password: hashSync(password, 10)
      }
    })

    if (admin) {
      return res
        .status(201)
        .json({ message: '¡Usuario administrador creado exitosamente!' })
    }
  } catch (error) {
    return res.status(500).json({
      error:
        'Error en el servidor, no se pudo crear el usuario administrador.' +
        error
    })
  }
}

// Verificar si el administrador existe y realiza la comprobacion para ejecutar el login.

export const loginAdmin = async function (req, res) {
  try {
    const { dni, password } = req.body
    const dniParser = parseInt(dni)
    const admin = await prisma.employee.findUnique({
      where: { dni: dniParser }
    })
    const passwordOk =
      admin === null ? false : await compareSync(password, admin.password)
    if (!passwordOk) {
      return res.status(401).json({ error: 'Usuario o clave incorrectos.' })
    }

    const token = jwt.sign(
      {
        id: admin.id,
        role: 'admin',
        isSuperAdmin: admin.isSuperAdmin
      },
      secret,
      { expiresIn: '24h' }
    )
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
    res.status(500).json({
      error: 'Error en el servidor, no se pudo loguear al empleado.'
    })
  } finally {
    prisma.$disconnect()
  }
}

// Funcion que retorna un administrador segun el dni.

export const getAdmin = async (req, res) => {
  try {
    const dni = parseInt(req.params.dni)

    const admin = await prisma.admin.findUnique({
      where: { dni: { dni } }
    })

    if (admin) {
      return res.status(200).json(admin)
    } else {
      return res.status(404).json({ error: '¡Administrador no encontrado!' })
    }
  } catch (error) {
    res.status(500).json({
      error: 'Error en el servidor, no se pudo retornar el administrador'
    })
  } finally {
    prisma.$disconnect()
  }
}
// Funcon para modificar un usuario administrador.

export const updateAdmin = async (req, res) => {
  try {
    const { firstName, lastName, dni, email, password } = req.body

    const verifyAdmin = await prisma.admin.findUnique({ where: { dni } })

    // Verificar si el administrador existe y procedemos a modificar los datos.

    if (!verifyAdmin) {
      return res
        .status(409)
        .json({ error: '¡El administrador no existe, verifique los datos!' })
    }

    const admin = await prisma.admin.update({
      data: {
        firstName: firstName.toLowerCase(),
        lastName: lastName.toLowerCase(),
        email: email.toLowerCase(),
        password: hashSync(password, 10)
      }
    })

    if (admin) {
      return res
        .status(201)
        .json({ message: '¡Usuario administrador modificado exitosamente!' })
    }
  } catch (error) {
    return res.status(500).json({
      error:
        'Error en el servidor, no se pudo modificar el usuario administrador.'
    })
  }
}

// Funcion para eliminar un usuario administrador.

export const deleteAdmin = async (req, res) => {
  try {
    const dni = parseInt(req.params.id)

    const verifyAdmin = await prisma.admin.findUnique({
      where: { dni }
    })

    if (!verifyAdmin) {
      return res.status(404).json({
        error: '!El administrador no existe, porfavor verifique los datos!'
      })
    }

    const admin = await prisma.admin.delete({
      where: {
        dni
      }
    })

    if (admin) {
      return res
        .status(200)
        .json({ message: '¡El administrador fue eliminado exitosamente!' })
    }
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, el administrador no pudo ser eliminado'
    })
  } finally {
    prisma.$disconnect()
  }
}
