export const verifySuperAdmin = (req, res, next) => {
  if (req.user.isSuperAdmin) {
    return next()
  }
  return res.status(403).json({
    message: '¡Acceso no autorizado, solo puede acceder un Super Administrador!'
  })
}
