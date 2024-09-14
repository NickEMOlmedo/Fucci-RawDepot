import { verify } from 'jsonwebtoken'

export const autenticarUsuario = async (req, res, next) => {
  const token = req.cookies.acces_token

  const secret = process.env.SECRET

  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó un token.' })
  }

  try {
    req.user = verify(token, secret)
  } catch (error) {
    req.user = null

    res.status(401).json({ message: '¡Acceso no autorizado, Token Invalido!' })
  }
  next()
}
