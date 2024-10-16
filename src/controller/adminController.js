import prisma from '../libs/db.js'
import pkg from 'bcryptjs'
import jwt from 'jsonwebtoken'

const { compareSync, hashSync } = pkg

const secret = process.env.SECRET

// Funcion para crear un nuevo usuario administrador.

export const createAdmin = async (req, res) => {
  try {
    const dni = parseInt(req.body.dni)
    const { firstName, lastName, email, password } = req.body
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
    const admin = await prisma.admin.findUnique({
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
      error: 'Error en el servidor, login fallido.'
    })
  }
}

// Funcion que retorna todos los administradores.

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await prisma.admin.findMany()
    if (admins.length === 0) {
      return res
        .status(404)
        .json({ error: 'No existen administradores para mostrar.' })
    }
    return res.status(200).json(
      admins.map(({ id, firstName, lastName, isSuperAdmin }) => ({
        id,
        firstName,
        lastName,
        isSuperAdmin
      }))
    )
  } catch (error) {
    return res.status(500).json({
      error:
        'Error en el servidor, no se pudieron retornar los administradores.'
    })
  }
}

// Funcion que retorna un administrador segun el dni.

export const getAdminByDni = async (req, res) => {
  try {
    const dni = parseInt(req.params.dni)
    const admin = await prisma.admin.findUnique({
      where: { dni }
    })

    if (admin) {
      return res.status(200).json({
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        dni,
        email: admin.email,
        isSuperAdmin: admin.isSuperAdmin
      })
    } else {
      return res.status(404).json({ error: '¡Administrador no encontrado!' })
    }
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudo retornar el administrador'
    })
  }
}

// Funcion que retorna un administrador segun el id.

export const getAdminById = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const admin = await prisma.admin.findUnique({
      where: { id }
    })

    if (admin) {
      return res.status(200).json({
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        isSuperAdmin: admin.isSuperAdmin
      })
    } else {
      return res.status(404).json({ error: '¡Administrador no encontrado!' })
    }
  } catch (error) {
    return res.status(500).json({
      error: 'Error en el servidor, no se pudo retornar el administrador'
    })
  }
}

// Funcion para modificar un usuario administrador.

export const updateAdmin = async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    const verifyAdmin = await prisma.admin.findUnique({ where: { id } })

    // Verificar si el administrador existe y procedemos a modificar los datos.

    if (!verifyAdmin) {
      return res
        .status(409)
        .json({ error: '¡El administrador no existe, verifique los datos!' })
    }
    const { firstName, lastName, dni, email, password } = req.body

    const existingDni = await prisma.admin.findUnique({
      where: { dni: parseInt(dni) }
    })

    if (existingDni) {
      if (dni && dni !== verifyAdmin.dni && existingDni.id !== verifyAdmin.id) {
        return res.status(409).json({
          error:
            '¡El DNI ya está en uso por otro administrador, ingrese uno difetente!'
        })
      }
    }

    const admin = await prisma.admin.update({
      where: { id },
      data: {
        firstName: firstName ? firstName.toLowerCase() : verifyAdmin.firstName,
        lastName: lastName ? lastName.toLowerCase() : verifyAdmin.lastName,
        dni: dni ? parseInt(dni) : verifyAdmin.dni,
        email: email ? email.toLowerCase() : verifyAdmin.email,
        ...(password && { password: hashSync(password, 10) })
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
    const id = parseInt(req.params.id)
    const verifyAdmin = await prisma.admin.findUnique({
      where: { id }
    })

    if (!verifyAdmin) {
      return res.status(404).json({
        error: '!El administrador no existe, porfavor verifique los datos!'
      })
    }

    const admin = await prisma.admin.delete({
      where: {
        id
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
  }
}
