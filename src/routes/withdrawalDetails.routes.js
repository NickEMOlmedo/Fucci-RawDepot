import { Router } from 'express'
import { param, body, validationResult } from 'express-validator'
import {
  createWithdrawalDetail,
  getAllWithdrawalDetails,
  getWithdrawalDetailWithId,
  searchWithdrawalDetailWithProduct,
  searchWithdrawalDetailWithStatus,
  updateWithdrawalDetail
} from '../controller/withdrawalDetailController.js'

const router = Router()

router.post(
  '/',
  [
    body('quantity')
      .notEmpty()
      .withMessage('La cantidad es obligatoria.')
      .bail()
      .trim()
      .isInt()
      .withMessage('La cantidad debe ser numerica.'),
    body('status')
      .notEmpty()
      .withMessage('El status es obligatorio.')
      .bail()
      .trim()
      .isAlpha()
      .withMessage('El status solo permite letras.'),
    body('notes')
      .trim()
      .isAlphanumeric()
      .withMessage('Solo se permiten letras o numeros.'),
    body('withdrawalId')
      .notEmpty()
      .withMessage('El ID del  retiro obligatorio.')
      .bail()
      .trim()
      .isInt()
      .withMessage('El ID solo puede ser numerico.'),
    body('productId')
      .notEmpty()
      .withMessage('El ID del producto es  obligatorio.')
      .bail()
      .trim()
      .isInt()
      .withMessage('El ID solo puede ser numerico.')
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
    createWithdrawalDetail(req, res)
  }
)
router.get('/', getAllWithdrawalDetails)
router.get(
  '/:id',
  [
    param('id')
      .notEmpty()
      .withMessage('El ID del detalle de retiro es obligatorio.')
      .bail()
      .trim()
      .isInt()
      .withMessage('El ID del detalle de retiro debe ser un valor numerico.')
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
    getWithdrawalDetailWithId(req, res)
  }
)
router.put(
  '/:id',
  [
    (param('id')
      .notEmpty()
      .withMessage('El ID del detalle de retiro es obligatorio.')
      .bail()
      .trim()
      .isInt()
      .withMessage('El ID del detalle de retiro debe ser un valor numerico.'),
    body('quantity')
      .optional()
      .trim()
      .isInt()
      .withMessage('La cantidad debe ser numerica.'),
    body('status')
      .optional()
      .trim()
      .isAlpha()
      .withMessage('El status solo permite letras.'),
    body('notes')
      .optional()
      .trim()
      .isAlphanumeric()
      .withMessage('Solo se permiten letras o numeros.'),
    body('withdrawalId')
      .optional()
      .trim()
      .isInt()
      .withMessage('El ID solo puede ser numerico.'),
    body('productId')
      .optional()
      .trim()
      .isInt()
      .withMessage('El ID solo puede ser numerico.'))
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
    updateWithdrawalDetail(req, res)
  }
)
router.get(
  '/search/status/:status',
  [
    param('status')
      .notEmpty()
      .withMessage('El status es obligatorio.')
      .bail()
      .trim()
      .isAlpha()
      .withMessage('Solo se permiten letras.')
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
    searchWithdrawalDetailWithStatus(req, res)
  }
)
router.get(
  '/search/product_id/:product_id',
  [
    param('product_id')
      .notEmpty()
      .withMessage('El ID del producto es obligatorio.')
      .bail()
      .trim()
      .isInt()
      .withMessage('Solo se permiten numeros.')
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
    searchWithdrawalDetailWithProduct(req, res)
  }
)

export default router
