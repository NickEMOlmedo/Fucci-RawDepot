import { Router } from 'express'
import { body, param, validationResult } from 'express-validator'
import {
  deleteEmployee,
  updateEmployee,
  createEmployee,
  loginEmployee,
  getAllEmployees,
  getEmployeeByDni,
  getEmployeeById
} from '../controller/employeeController.js'
import { authUser } from '../middleware/auth.js'
import { logoutAllUsers } from '../middleware/logoutAllUsers.js'
import { verifySuperAdmin } from '../middleware/verifySuperAdmin.js'

const router = Router()

router.post(
  '/auth/register',
  authUser,
  verifySuperAdmin,
  [
    body('firstName')
      .trim()
      .notEmpty()
      .withMessage('El nombre es obligatorio.')
      .bail()
      .isAlpha()
      .withMessage('El nombre solo puede contener letras.')
      .isLength({ min: 3 })
      .withMessage('El nombre debe tener al menos 3 caracteres.'),
    body('lastName')
      .trim()
      .notEmpty()
      .withMessage('El apellido es obligatorio.')
      .bail()
      .isAlpha()
      .withMessage('El apellido solo puede contener letras.')
      .isLength({ min: 3 })
      .withMessage('El apellido debe tener al menos 3 caracteres.'),
    body('dni')
      .trim()
      .notEmpty()
      .withMessage('El DNI es obligatorio.')
      .bail()
      .isNumeric()
      .withMessage('El DNI debe contener solo números.')
      .isLength({ min: 7, max: 8 })
      .withMessage('El DNI debe tener 7 o 8 dígitos.'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('La contraseña es obligatoria.')
      .bail()
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
      .withMessage('La contraseña no debe contener espacios en blanco.'),
    body('area')
      .trim()
      .notEmpty()
      .withMessage('El area es obligatoria.')
      .bail()
      .isAlpha()
      .withMessage('El area solo puede contener letras.')
      .isLength({ min: 3 })
      .withMessage('El area debe tener al menos 3 caracteres.'),
    body('role')
      .trim()
      .notEmpty()
      .withMessage('El rol es obligatorio.')
      .bail()
      .isAlpha()
      .withMessage('El rol solo puede contener letras.')
      .isLength({ min: 3 })
      .withMessage('El rol debe tener al menos 3 caracteres.')
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
    createEmployee(req, res)
  }
)

router.post(
  '/auth/login',
  [
    body('dni')
      .trim()
      .notEmpty()
      .bail()
      .withMessage('¡El DNI o la contraseña son incorrectos!')
      .isNumeric()
      .withMessage('¡El DNI o la contraseña son incorrectos!')
      .bail()
      .isLength({ min: 7, max: 8 })
      .withMessage('¡El DNI o la contraseña son incorrectos!'),
    body('password')
      .trim()
      .notEmpty('¡El DNI o la contraseña son incorrectos!')
      .bail()
      .withMessage('¡El DNI o la contraseña son incorrectos!')
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
    loginEmployee(req, res)
  }
)
router.post('/auth/logout', authUser, logoutAllUsers)
router.get('/', verifySuperAdmin, getAllEmployees)
router.get(
  '/dni/:dni',
  authUser,
  verifySuperAdmin,
  [
    param('dni')
      .trim()
      .notEmpty()
      .withMessage('El DNI es obligatorio.')
      .bail()
      .isNumeric()
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
    getEmployeeByDni(req, res)
  }
)
router.get(
  '/id/:id',
  authUser,
  verifySuperAdmin[
    param('id')
      .trim()
      .notEmpty()
      .withMessage('El ID es obligatorio.')
      .bail()
      .isNumeric()
      .withMessage('El ID debe contener solo números.')
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
    getEmployeeById(req, res)
  }
)
router.put(
  '/auth/update/:id',
  authUser,
  verifySuperAdmin,
  [
    param('id')
      .trim()
      .notEmpty()
      .withMessage('El ID es obligatorio.')
      .bail()
      .isNumeric()
      .withMessage('El ID debe contener solo números.'),
    body('firstName')
      .trim()
      .notEmpty()
      .withMessage('El nombre es obligatorio.')
      .bail()
      .isAlpha()
      .withMessage('El nombre solo puede contener letras.')
      .isLength({ min: 3 })
      .withMessage('El nombre debe tener al menos 3 caracteres.'),
    body('lastName')
      .trim()
      .notEmpty()
      .withMessage('El apellido es obligatorio.')
      .bail()
      .isAlpha()
      .withMessage('El apellido solo puede contener letras.')
      .isLength({ min: 3 })
      .withMessage('El apellido debe tener al menos 3 caracteres.'),
    body('dni')
      .trim()
      .notEmpty()
      .withMessage('El DNI es obligatorio.')
      .bail()
      .isNumeric()
      .withMessage('El DNI debe contener solo números.')
      .isLength({ min: 7, max: 8 })
      .withMessage('El DNI debe tener 7 o 8 dígitos.'),
    body('password')
      .trim()
      .notEmpty().withMessage('La contraseña es obligatoria.')
      .bail()
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
      .withMessage('La contraseña no debe contener espacios en blanco.'),
    body('area')
      .trim()
      .notEmpty()
      .withMessage('El area es obligatoria.')
      .bail()
      .isAlpha()
      .withMessage('El area solo puede contener letras.')
      .isLength({ min: 3 })
      .withMessage('El area debe tener al menos 3 caracteres.'),
    body('role')
      .trim()
      .notEmpty()
      .withMessage('El rol es obligatorio.')
      .bail()
      .isAlpha()
      .withMessage('El rol solo puede contener letras.')
      .isLength({ min: 3 })
      .withMessage('El rol debe tener al menos 3 caracteres.')
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
    updateEmployee(req, res)
  }
)
router.delete(
  '/auth/delete/:id',
  authUser,
  verifySuperAdmin,
  [
    param('id')
      .trim()
      .notEmpty()
      .withMessage('El ID es obligatorio.')
      .bail()
      .isNumeric()
      .withMessage('El ID debe contener solo números.')
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
    deleteEmployee(req, res)
  }
)

export default router
