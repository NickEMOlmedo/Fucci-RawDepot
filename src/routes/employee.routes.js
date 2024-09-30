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
import { logoutAllUsers } from '../middleware/logoutAllUsers.js'

const router = Router()

router.post(
  '/',
  createEmployee,
  [
    body('firstName')
      .trim()
      .notEmpty()
      .withMessage('El nombre es obligatorio.')
      .isAlpha()
      .withMessage('El nombre solo puede contener letras.')
      .isLength({ min: 3 })
      .withMessage('El nombre debe tener al menos 3 caracteres.'),
    body('lastName')
      .trim()
      .notEmpty()
      .withMessage('El apellido es obligatorio.')
      .isAlpha()
      .withMessage('El apellido solo puede contener letras.')
      .isLength({ min: 3 })
      .withMessage('El apellido debe tener al menos 3 caracteres.'),
    body('dni')
      .trim()
      .notEmpty()
      .withMessage('El DNI es obligatorio.')
      .isNumeric()
      .withMessage('El DNI debe contener solo números.')
      .isLength({ min: 7, max: 8 })
      .withMessage('El DNI debe tener 7 o 8 dígitos.'),
    body('password')
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
      .withMessage('La contraseña no debe contener espacios en blanco.'),
    body('area')
      .trim()
      .notEmpty()
      .withMessage('El area es obligatorio.')
      .isAlpha()
      .withMessage('El area solo puede contener letras.')
      .isLength({ min: 3 })
      .withMessage('El nombre debe tener al menos 3 caracteres.'),
    body('role')
      .trim()
      .notEmpty()
      .withMessage('El area es obligatorio.')
      .isAlpha()
      .withMessage('El area solo puede contener letras.')
      .isLength({ min: 3 })
      .withMessage('El nombre debe tener al menos 3 caracteres.')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
  }
)

router.post(
  '/auth/login',
  loginEmployee,
  [
    body('dni')
      .trim()
      .notEmpty()
      .withMessage('¡El DNI o la contraseña son incorrectos!')
      .isNumeric()
      .withMessage('¡El DNI o la contraseña son incorrectos!')
      .isLength({ min: 7, max: 8 })
      .withMessage('¡El DNI o la contraseña son incorrectos!'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('¡El DNI o la contraseña son incorrectos!')
      .isLength({ min: 8 })
      .withMessage('¡El DNI o la contraseña son incorrectos!')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
  }
)
router.post('/auth/logout', logoutAllUsers)
router.get('/', getAllEmployees)
router.get(
  '/dni/:dni',
  getEmployeeByDni,
  [
    param('dni')
      .trim()
      .notEmpty()
      .withMessage('El DNI es obligatorio.')
      .isNumeric()
      .withMessage('El DNI debe contener solo números.')
      .isLength({ min: 7, max: 8 })
      .withMessage('El DNI debe tener 7 o 8 dígitos.')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
  }
)
router.get(
  '/id/:id',
  getEmployeeById,
  [
    param('id')
      .trim()
      .notEmpty()
      .withMessage('El id es obligatorio.')
      .isNumeric()
      .withMessage('El id debe contener solo números.')
      .isLength({ min: 1, max: 10 })
      .withMessage('El id debe tener minimo 1 digito y maximo 10.')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
  }
)
router.put(
  '/:id',
  updateEmployee,
  [
    param('id')
      .trim()
      .notEmpty()
      .withMessage('El id es obligatorio.')
      .isNumeric()
      .withMessage('El id debe contener solo números.')
      .isLength({ min: 1, max: 10 })
      .withMessage('El id debe tener minimo 1 digito y maximo 10.')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
  }
)
router.delete(
  '/:id',
  deleteEmployee,
  [
    param('id')
      .trim()
      .notEmpty()
      .withMessage('El id es obligatorio.')
      .isNumeric()
      .withMessage('El id debe contener solo números.')
      .isLength({ min: 1, max: 10 })
      .withMessage('El id debe tener minimo 1 digito y maximo 10.')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
  }
)

export default router
