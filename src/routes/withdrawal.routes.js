import { Router } from 'express'
import { body, param, validationResult } from 'express-validator'
import {
  createWithdrawal,
  deleteWithdrawal,
  getAllWithdrawals,
  getWithdrawalBydId,
  searchWithdrawalWithAdmin,
  searchWithdrawalWithDate,
  searchWithdrawalWithEmployee,
  updateWithdrawal
} from '../controller/withdrawalController.js'

const router = Router()

router.post(
  '/',
  createWithdrawal,
  [
    body('withDrawalDate')
      .notEmpty()
      .withMessage('La fecha de extraccion es obligatoria.')
      .isISO8601()
      .withMessage('Formato de fecha invalido.')
      .toDate(),
    body('employeeDni')
      .optional()
      .notEmpty()
      .withMessage('El DNI del empleado es obligatorio.')
      .custom((value, { req }) => {
        if (!value && !req.body.employeeDni) {
          throw new Error(
            'Debe proporcionar al menos uno de los dos campos: El DNI del empleado o el DNI del administrador.'
          )
        }
      }),
    body('adminDni')
      .optional()
      .notEmpty()
      .withMessage('El DNI del administrador es obligatorio')
      .custom((value, { req }) => {
        if (!value && !req.body.adminDni) {
          throw new Error(
            'Debe proporcionar al menos uno de los dos campos: El DNI del empleado o el DNI del administrador.'
          )
        }
      })
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    createWithdrawal(req, res)
  }
)
router.get('/', getAllWithdrawals)
router.get(
  '/:id',
  [
    param('id')
      .trim()
      .notEmpty()
      .withMessage('EL ID del retiro es obligatorio.')
      .isNumeric()
      .withMessage('El ID del retiro debe ser un valor numerico.')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    getWithdrawalBydId(req, res)
  }
)
router.put(
  '/:id',
  [
    param('id')
      .trim()
      .notEmpty()
      .withMessage('El ID del retiro es obligatorio.')
      .isNumeric()
      .withMessage('El ID del retiro debe ser un valor numerico.'),
    body('withDrawalDate')
      .notEmpty()
      .withMessage('La fecha de extraccion es obligatoria.')
      .isISO8601()
      .withMessage('Formato de fecha invalido.')
      .toDate(),
    body('employeeDni')
      .optional()
      .notEmpty()
      .withMessage('El DNI del empleado es obligatorio')
      .custom((value, { req }) => {
        if (!value && !req.body.employeeDni) {
          throw new Error(
            'Debe proporcionar al menos uno de los dos campos: El DNI del empleado o el DNI del administrador.'
          )
        }
      }),
    body('adminDni')
      .optional()
      .notEmpty()
      .withMessage('El DNI del administrador es obligatorio')
      .custom((value, { req }) => {
        if (!value && !req.body.adminDni) {
          throw new Error(
            'Debe proporcionar al menos uno de los dos campos: El DNI del empleado o el DNI del administrador.'
          )
        }
      })
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    updateWithdrawal(req, res)
  }
)
router.delete(
  '/:id',
  [
    param('id')
      .trim()
      .notEmpty()
      .withMessage('El ID del retiro es obligatorio.')
      .isNumeric()
      .withMessage('El ID del retiro debe ser un valor numerico.')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    deleteWithdrawal(req, res)
  }
)
router.get(
  '/search/:withdrawal_date',
  [
    param('id')
      .trim()
      .isEmpty()
      .withMessage('La fecha de retiro es obligatoria.')
      .isISO8601()
      .withMessage('Formato de fecha invalida')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    searchWithdrawalWithDate(req, res)
  }
)
router.get(
  '/search/:employee_dni',
  [
    param('id')
      .trim()
      .isEmpty()
      .withMessage('El DNI del empleado es obligatorio.')
      .isNumeric()
      .withMessage('El DNI solo puede ser numerico.')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    searchWithdrawalWithEmployee(req, res)
  }
)
router.get(
  '/search/:admin_dni',
  [
    param('id')
      .trim()
      .isEmpty()
      .withMessage('El DNI del administrador es obligatorio.')
      .isNumeric()
      .withMessage('El DNI solo puede ser numerico.')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    searchWithdrawalWithAdmin(req, res)
  }
)

export default router
