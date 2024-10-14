import { Router } from 'express'
import { body, param, validationResult } from 'express-validator'
import {
  createEntry,
  deleteEntry,
  getAllEntrys,
  getEntryById,
  searchEntryByAdmin,
  searchEntryByDate,
  searchEntryByDeliveryCompany,
  searchEntryByProductType,
  searchEntryByReceiptCode,
  searchEntryByStatus,
  updateEntry
} from '../controller/entryController.js'

const router = Router()

router.post(
  '/',
  [
    body('producType')
      .notEmpty()
      .withMessage('El tipo de producto es obligatorio.')
      .bail()
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('El largo debe estar entre 3 y 30 digitos.'),
    body('receiptCode')
      .notEmpty()
      .withMessage('El codigo de remito es obligatorio.')
      .bail()
      .trim()
      .isAlphanumeric()
      .withMessage('El codigo de remito solo permite letras y numeros.')
      .isLength({ min: 3, max: 30 })
      .withMessage('El largo debe estar entre 3 y 30 digitos.'),
    body('deliveryCompany')
      .notEmpty()
      .withMessage('El nombre de la compañia de envio es obligatorio.')
      .bail()
      .trim()
      .isAlphanumeric()
      .withMessage(
        'El nombre de la compañia de envio solo permite letras y numeros.'
      )
      .isLength({ min: 3, max: 30 })
      .withMessage('El largo debe estar entre 3 y 30 digitos.'),
    body('entryDate')
      .withMessage('La fecha de entrada es obligatoria.')
      .bail()
      .notEmpty()
      .isISO8601()
      .withMessage('Formato de fecha invalido.')
      .toDate(),
    body('quantity')
      .notEmpty()
      .withMessage('La cantidad es obligatoria.')
      .bail()
      .trim()
      .isInt()
      .withMessage('Solo se permiten numeros.'),
    body('status')
      .notEmpty()
      .withMessage('El status es obligatorio.')
      .bail()
      .trim()
      .isAlpha()
      .withMessage('El status solo permite letras.')
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
    createEntry(req, res)
  }
)
router.get('/', getAllEntrys)
router.get(
  '/:id',
  [
    param('id')
      .notEmpty()
      .withMessage('El ID es obligatorio.')
      .bail()
      .trim()
      .isInt()
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
    getEntryById(req, res)
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
      .withMessage('El ID debe contener solo números.'),
    body('producType')
      .optional()
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('El largo debe estar entre 3 y 30 digitos.'),
    body('receiptCode')
      .optional()
      .trim()
      .isAlphanumeric()
      .withMessage('El codigo de remito solo permite letras y numeros.')
      .isLength({ min: 3, max: 30 })
      .withMessage('El largo debe estar entre 3 y 30 digitos.'),
    body('deliveryCompany')
      .optional()
      .trim()
      .isAlphanumeric()
      .withMessage(
        'El nombre de la compañia de envio solo permite letras y numeros.'
      )
      .isLength({ min: 3, max: 30 })
      .withMessage('El largo debe estar entre 3 y 30 digitos.'),
    body('entryDate')
      .optional()
      .isISO8601()
      .withMessage('Formato de fecha invalido.')
      .toDate(),
    body('quantity')
      .optional()
      .trim()
      .isInt()
      .withMessage('Solo se permiten numeros.'),
    body('status')
      .optional()
      .trim()
      .isAlpha()
      .withMessage('El status solo permite letras.')
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
    updateEntry(req, res)
  }
)
router.delete(
  '/:id',
  [
    param('id')
      .notEmpty()
      .withMessage('El ID es obligatorio.')
      .trim()
      .bail()
      .isInt()
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
    deleteEntry(req, res)
  }
)
router.get(
  '/search/:product_type',
  [
    param('product_type')
      .notEmpty()
      .withMessage('El término de búsqueda es obligatorio.')
      .trim()
      .bail()
      .isAlphanumeric()
      .withMessage(
        'El término de búsqueda solo puede contener letras y números.'
      )
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
    searchEntryByProductType(req, res)
  }
)

router.get(
  '/search/:receipt_code',
  [
    param('receipt_code')
      .notEmpty()
      .withMessage('El codigo de remito es obligatorio.')
      .trim()
      .bail()
      .isAlphanumeric()
      .withMessage(
        'El término de búsqueda solo puede contener letras y números.'
      )
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
    searchEntryByReceiptCode(req, res)
  }
)

router.get(
  '/search/:delivery_company',
  [
    param('delivery_company')
      .notEmpty()
      .withMessage('La compañia de envio es obligatoria.')
      .trim()
      .bail()
      .isAlphanumeric()
      .withMessage(
        'El término de búsqueda solo puede contener letras y números.'
      )
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
    searchEntryByDeliveryCompany(req, res)
  }
)
router.get(
  '/search/:entry_date',
  [
    param('entry_date')
      .notEmpty()
      .withMessage('La fecha de entrada es obligatoria.')
      .bail()
      .isISO8601()
      .withMessage('Formato de fecha invalido.')
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
    searchEntryByDate(req, res)
  }
)
router.get(
  '/search/:status',
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
    searchEntryByStatus(req, res)
  }
)
router.get(
  '/search/:admin_dni',
  [
    param('admin_dni')
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
    searchEntryByAdmin(req, res)
  }
)

export default router
