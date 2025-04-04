export const verifyAdmin = (req, res, next) => {
  if (req.user.role === 'admin') {
    return next()
  }
  return res
    .status(403)
    .json({ message: '¡Acceso no autorizado, solo administradores!' })
}
