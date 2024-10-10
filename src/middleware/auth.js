import pkg from 'jsonwebtoken'
const { verify } = pkg

export const authUser = async (req, res, next) => {
  const token = req.cookies.acces_token

  const secret = process.env.SECRET

  if (!token) {
    return res
      .status(401)
      .json({ message: '¡Acceso no autorizado! Inicia sesion nuevamente...' })
  }

  try {
    req.user = verify(token, secret)
  } catch (error) {
    req.user = null
    return res
      .status(401)
      .json({ message: '¡Acceso no autorizado! Inicia sesion nuevamente...' })
  }
  next()
}
