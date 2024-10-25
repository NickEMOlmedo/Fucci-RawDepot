import { Router } from 'express'
import { body, param, validationResult } from 'express-validator'
import {
  createAdmin,
  deleteAdmin,
  getAdminByDni,
  getAdminById,
  getAllAdmins,
  loginAdmin,
  updateAdmin
} from '../controller/adminController.js'
import { logoutAllUsers } from '../middleware/logoutAllUsers.js'
import { authUser } from '../middleware/auth.js'
import { verifySuperAdmin } from '../middleware/verifySuperAdmin.js'
import { verifyAdmin } from '../middleware/verifyAdmin.js'

const router = Router()

router.post(
  '/auth/register',
  authUser,
  verifySuperAdmin,
  [
    (body('firstName')
      .notEmpty()
      .withMessage('El nombre es obligatorio.')
      .bail()
      .trim()
      .isAlpha()
      .withMessage('El nombre solo puede contener letras.')
      .isLength({ min: 3 })
      .withMessage('El nombre debe tener al menos 3 caracteres.'),
    body('lastName')
      .notEmpty()
      .withMessage('El apellido es obligatorio.')
      .bail()
      .trim()
      .isAlpha()
      .withMessage('El apellido solo puede contener letras.')
      .isLength({ min: 3 })
      .withMessage('El apellido debe tener al menos 3 caracteres.'),
    body('dni')
      .notEmpty()
      .withMessage('El DNI es obligatorio.')
      .bail()
      .trim()
      .isInt()
      .withMessage('El DNI debe contener solo números.')
      .isLength({ min: 7, max: 8 })
      .withMessage('El DNI debe tener 7 o 8 dígitos.'),
    body('email')
      .notEmpty()
      .withMessage('El correo electrónico es obligatorio.')
      .bail()
      .trim()
      .isEmail()
      .withMessage('Debe proporcionar un correo electrónico válido.'),
    body('password')
      .notEmpty()
      .withMessage('La contraseña es obligatoria.')
      .bail()
      .trim()
      .isLength({ min: 8 })
      .withMessage('La contraseña debe tener al menos 8 caracteres.')
      .matches(/[A-Z]/)
      .withMessage('La contraseña debe contener al menos una letra mayúscula.')
      .matches(/[a-z]/)
      .withMessage('La contraseña debe contener al menos una letra minúscula.')
      .matches(/[0-9]/)
      .withMessage('La contraseña debe contener al menos un número.')
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage('La contraseña debe contener al menos un carácter especial.')
      .matches(/^\S*$/, 'g')
      .withMessage('La contraseña no debe contener espacios en blanco.'))
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const filterErrors = errors.array().map(error => ({
        path: error.path,
        msg: error.msg
      }))
      return res.status(400).json({ errors: filterErrors })
    }
    createAdmin(req, res)
  }
)
router.post(
  '/auth/login',
  [
    body('dni')
      .notEmpty()
      .withMessage('¡El DNI o la contraseña son incorrectos!')
      .bail()
      .trim()
      .isInt()
      .withMessage('¡El DNI o la contraseña son incorrectos!')
      .bail()
      .isLength({ min: 7, max: 8 })
      .withMessage('¡El DNI o la contraseña son incorrectos!'),
    body('password')
      .notEmpty()
      .withMessage('¡El DNI o la contraseña son incorrectos!')
      .bail()
      .trim()
      .isLength({ min: 8 })
      .withMessage('¡El DNI o la contraseña son incorrectos!')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const filterErrors = errors.array().map(error => ({
        path: error.path,
        msg: error.msg
      }))
      return res.status(400).json({ errors: filterErrors })
    }
    loginAdmin(req, res)
  }
)
router.post('/auth/logout', authUser, verifyAdmin, logoutAllUsers)
router.get('/', authUser, verifySuperAdmin, getAllAdmins)
router.get(
  '/dni/:dni',
  authUser,
  verifySuperAdmin,
  [
    param('dni')
      .notEmpty()
      .withMessage('El DNI es obligatorio.')
      .bail()
      .trim()
      .isInt()
      .withMessage('El DNI debe contener solo números.')
      .isLength({ min: 7, max: 8 })
      .withMessage('El DNI debe tener 7 o 8 dígitos.')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const filterErrors = errors.array().map(error => ({
        path: error.path,
        msg: error.msg
      }))
      return res.status(400).json({ errors: filterErrors })
    }
    getAdminByDni(req, res)
  }
)
router.get(
  '/id/:id',
  authUser,
  verifySuperAdmin,
  [
    param('id')
      .notEmpty()
      .withMessage('El ID es obligatorio.')
      .bail()
      .trim()
      .isInt()
      .withMessage('El ID debe contener solo números.')
      .isLength({ min: 1, max: 10 })
      .withMessage('El ID debe tener minimo 1 digito y maximo 10.')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const filterErrors = errors.array().map(error => ({
        path: error.path,
        msg: error.msg
      }))
      return res.status(400).json({ errors: filterErrors })
    }
    getAdminById(req, res)
  }
)
router.put(
  '/auth/update/:id',
  authUser,
  verifySuperAdmin,
  [
    param('id')
      .notEmpty()
      .withMessage('El ID es obligatorio.')
      .bail()
      .trim()
      .isInt()
      .withMessage('El ID debe contener solo números.')
      .isLength({ min: 1, max: 10 })
      .withMessage('El ID debe tener minimo 1 digito y maximo 10.'),
    body('firstName')
      .optional()
      .trim()
      .isAlpha()
      .withMessage('El nombre solo puede contener letras.')
      .isLength({ min: 3 })
      .withMessage('El nombre debe tener al menos 3 caracteres.'),
    body('lastName')
      .optional()
      .trim()
      .isAlpha()
      .withMessage('El apellido solo puede contener letras.')
      .isLength({ min: 3 })
      .withMessage('El apellido debe tener al menos 3 caracteres.'),
    body('dni')
      .optional()
      .trim()
      .isInt()
      .withMessage('El DNI debe contener solo números.')
      .isLength({ min: 7, max: 8 })
      .withMessage('El DNI debe tener 7 o 8 dígitos.'),
    body('email')
      .optional()
      .trim()
      .isEmail()
      .withMessage('Debe proporcionar un email valido.'),
    body('password')
      .optional()
      .trim()
      .isLength({ min: 8 })
      .withMessage('La contraseña debe tener al menos 8 caracteres.')
      .matches(/[A-Z]/)
      .withMessage('La contraseña debe contener al menos una letra mayúscula.')
      .matches(/[a-z]/)
      .withMessage('La contraseña debe contener al menos una letra minúscula.')
      .matches(/[0-9]/)
      .withMessage('La contraseña debe contener al menos un número.')
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage('La contraseña debe contener al menos un carácter especial.')
      .matches(/^\S*$/, 'g')
      .withMessage('La contraseña no debe contener espacios en blanco.')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const filterErrors = errors.array().map(error => ({
        path: error.path,
        msg: error.msg
      }))
      return res.status(400).json({ errors: filterErrors })
    }
    updateAdmin(req, res)
  }
)
router.delete(
  '/auth/delete/:id',
  authUser,
  verifySuperAdmin,
  [
    param('id')
      .notEmpty()
      .withMessage('El ID es obligatorio.')
      .trim()
      .bail()
      .isInt()
      .withMessage('El ID debe contener solo números.')
      .isLength({ min: 1, max: 10 })
      .withMessage('El ID debe tener minimo 1 digito y maximo 10.')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const filterErrors = errors.array().map(error => ({
        path: error.path,
        msg: error.msg
      }))
      return res.status(400).json({ errors: filterErrors })
    }
    deleteAdmin(req, res)
  }
)

export default router
