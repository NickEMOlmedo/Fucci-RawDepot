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
      .notEmpty()
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
    createEmployee(req, res)
  }
)

router.post(
  '/auth/login',
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
    loginEmployee(req, res)
  }
)
router.post('/auth/logout', logoutAllUsers)
router.get('/', getAllEmployees)
router.get(
  '/dni/:dni',
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
    getEmployeeByDni(req, res)
  }
)
router.get(
  '/id/:id',
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
    getEmployeeById(req, res)
  }
)
router.put(
  '/:id',
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
    updateEmployee(req, res)
  }
)
router.delete(
  '/:id',
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
    deleteEmployee(req, res)
  }
)

export default router
