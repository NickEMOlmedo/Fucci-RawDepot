import { verify } from 'jsonwebtoken'

export const autenticarEmpleado = async (req, res, next) => {
  const token = req.cookies.acces_token

  const secret = process.env.SECRET

  let data = null

  req.session = { empleado: null }

  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó un token.' })
  }

  try {
    data = verify(token, secret)

    req.session.empleado = data
  } catch (error) {
    req.session.empleado = null

    res.status(401).json({ message: '¡Acceso no autorizado, Token Invalido!' })
  }
  next()
}
