import { Router } from 'express'
import { body, param, validationResult } from 'express-validator'
import {
  createWithdrawal,
  deleteWithdrawal,
  getAllWithdrawals,
  getWithdrawalById,
  searchWithdrawalByAdmin,
  searchWithdrawalByDate,
  searchWithdrawalByDateRange,
  searchWithdrawalByEmployee,
  updateWithdrawal
} from '../controller/withdrawalController.js'

const router = Router()

router.post(
  '/',
  createWithdrawal,
  [
    body('employeeId')
      .optional()
      .custom((value, { req }) => {
        if (!value && !req.body.employeeDni) {
          throw new Error(
            'Debe proporcionar al menos uno de los dos campos: El id del empleado o el id del administrador.'
          )
        }
      })
      .bail()
      .trim()
      .isInt()
      .withMessage('El id debe contener solo números.')
      .isLength({ min: 7, max: 8 })
      .withMessage('El id debe tener 7 o 8 dígitos.'),
    body('adminId')
      .optional()
      .custom((value, { req }) => {
        if (!value && !req.body.adminDni) {
          throw new Error(
            'Debe proporcionar al menos uno de los dos campos: El id del empleado o el id del administrador.'
          )
        }
      })
      .bail()
      .trim()
      .isInt()
      .withMessage('El id debe contener solo números.')
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
    createWithdrawal(req, res)
  }
)
router.get('/', getAllWithdrawals)
router.get(
  '/:id',
  [
    param('id')
      .notEmpty()
      .withMessage('EL ID es obligatorio.')
      .bail()
      .trim()
      .isInt()
      .withMessage('El ID del retiro debe ser un valor numerico.')
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
    getWithdrawalById(req, res)
  }
)
router.put(
  '/:id',
  [
    param('id')
      .notEmpty()
      .withMessage('El ID es obligatorio.')
      .bail()
      .trim()
      .isInt()
      .withMessage('El ID del retiro debe ser un valor numerico.'),
    body('employeeId')
      .optional()
      .custom((value, { req }) => {
        if (!value && !req.body.employeeDni) {
          throw new Error(
            'Debe proporcionar al menos uno de los dos campos: El id del empleado o el id del administrador.'
          )
        }
      })
      .bail()
      .trim()
      .isInt()
      .withMessage('El id debe contener solo números.'),
    body('adminId')
      .optional()
      .custom((value, { req }) => {
        if (!value && !req.body.adminDni) {
          throw new Error(
            'Debe proporcionar al menos uno de los dos campos: El id del empleado o el id del administrador.'
          )
        }
      })
      .bail()
      .trim()
      .isInt()
      .withMessage('El id debe contener solo números.')
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
    updateWithdrawal(req, res)
  }
)
router.delete(
  '/:id',
  [
    param('id')
      .notEmpty()
      .withMessage('El ID es obligatorio.')
      .bail()
      .trim()
      .isInt()
      .withMessage('El ID del retiro debe ser un valor numerico.')
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
    deleteWithdrawal(req, res)
  }
)
router.get(
  '/search/withdrawal_date/:withdrawal_date',
  [
    param('withdrawal_date')
      .notEmpty()
      .withMessage('El termino de busqueda es obligatorio.')
      .bail()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Formato de fecha inválido. Usa YYYY-MM-DD.')
      .toDate()
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
    searchWithdrawalByDate(req, res)
  }
)

router.get(
  '/search/withdrawalDate_byrange',
  [
    body('withdrawalDate_start')
      .notEmpty()
      .withMessage('El termino de busqueda es obligatorio.')
      .bail()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Formato de fecha inválido. Usa YYYY-MM-DD.')
      .toDate(),
    body('withdrawalDate_end')
      .notEmpty()
      .withMessage('El termino de busqueda es obligatorio.')
      .bail()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Formato de fecha inválido. Usa YYYY-MM-DD.')
      .toDate()
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
    searchWithdrawalByDateRange(req, res)
  }
)
router.get(
  '/search/employee_id/:employee_id',
  [
    param('employee_id')
      .notEmpty()
      .withMessage('El termino de busqueda es obligatorio.')
      .bail()
      .trim()
      .isInt()
      .withMessage('El termino de busqueda solo puede ser numerico.')
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
    searchWithdrawalByEmployee(req, res)
  }
)
router.get(
  '/search/admin_id/:admin_id',
  [
    param('admin_id')
      .notEmpty()
      .withMessage('El termino de busqueda es obligatorio.')
      .bail()
      .trim()
      .isInt()
      .withMessage('El termino de busqueda solo puede ser numerico.')
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
    searchWithdrawalByAdmin(req, res)
  }
)

export default router
