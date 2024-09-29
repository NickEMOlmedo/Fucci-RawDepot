// Middleware de logout tanto para admins como para empleados.

export const logoutAllUsers = (req, res) => {
  res.clearCookie('access_token')
  return res
    .status(200)
    .json({ message: 'Usted ha cerrado sesion exitosamente.' })
}
