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
      .trim()
      .notEmpty()
      .withMessage('La cantidad es obligatoria.')
      .bail()
      .isNumeric()
      .withMessage('La cantidad debe ser numerica.'),
    body('status')
      .trim()
      .notEmpty()
      .withMessage('El status es obligatorio.')
      .bail()
      .isAlpha()
      .withMessage('El status solo permite letras.'),
    body('notes')
      .trim()
      .isAlphanumeric()
      .withMessage('Solo se permiten letras o numeros.'),
    body('withdrawalId')
      .trim()
      .isEmpty()
      .withMessage('El ID del  retiro obligatorio.')
      .bail()
      .isNumeric()
      .withMessage('El ID solo puede ser numerico.'),
    body('productId')
      .trim()
      .isEmpty()
      .withMessage('El ID del producto es  obligatorio.')
      .bail()
      .isNumeric()
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
      .trim()
      .notEmpty()
      .withMessage('El ID del detalle de retiro es obligatorio.')
      .bail()
      .isNumeric()
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
      .trim()
      .notEmpty()
      .withMessage('El ID del detalle de retiro es obligatorio.')
      .bail()
      .isNumeric()
      .withMessage('El ID del detalle de retiro debe ser un valor numerico.'),
    body('quantity')
      .trim()
      .notEmpty()
      .withMessage('La cantidad es obligatoria.')
      .bail()
      .isNumeric()
      .withMessage('La cantidad debe ser numerica.'),
    body('status')
      .trim()
      .notEmpty()
      .withMessage('El status es obligatorio.')
      .bail()
      .isAlpha()
      .withMessage('El status solo permite letras.'),
    body('notes')
      .trim()
      .isAlphanumeric()
      .withMessage('Solo se permiten letras o numeros.'),
    body('withdrawalId')
      .trim()
      .isEmpty()
      .withMessage('El ID del  retiro obligatorio.')
      .bail()
      .isNumeric()
      .withMessage('El ID solo puede ser numerico.'),
    body('productId')
      .trim()
      .isEmpty()
      .withMessage('El ID del producto es  obligatorio.')
      .bail()
      .isNumeric()
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
  '/search/:status',
  [
    param('status')
      .trim()
      .notEmpty()
      .withMessage('El status es obligatorio.')
      .bail()
      .isAlpha('Solo se permiten letras.')
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
  '/search/:product_id',
  [
    param('product_id')
      .trim()
      .notEmpty()
      .withMessage('El ID del producto es obligatorio.')
      .bail()
      .isNumeric('Solo se permiten numeros.')
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
