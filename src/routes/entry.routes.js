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
  createEntry,
  [
    body('producType')
      .trim()
      .notEmpty()
      .withMessage('El tipo de producto es obligatorio.')
      .isLength({ min: 3, max: 30 })
      .withMessage('El largo debe estar entre 3 y 30 digitos.'),
    body('receiptCode')
      .trim()
      .notEmpty()
      .withMessage('El codigo de remito es obligatorio.')
      .isAlphanumeric()
      .withMessage('El codigo de remito solo permite letras y numeros.')
      .isLength({ min: 3, max: 30 })
      .withMessage('El largo debe estar entre 3 y 30 digitos.'),
    body('deliveryCompany')
      .trim()
      .notEmpty()
      .withMessage('El nombre de la compañia de envio es obligatorio.')
      .isAlphanumeric()
      .withMessage(
        'El nombre de la compañia de envio solo permite letras y numeros.'
      )
      .isLength({ min: 3, max: 30 })
      .withMessage('El largo debe estar entre 3 y 30 digitos.'),
    body('entryDate')
      .isDate()
      .withMessage('La fecha debe ser una fecha válida.')
      .toDate(),
    body('quantity')
      .trim()
      .notEmpty()
      .withMessage('La cantidad es obligatoria.')
      .isNumeric()
      .withMessage('Solo se permiten numeros.'),
    body('status')
      .trim()
      .notEmpty()
      .withMessage('El status es obligatorio.')
      .isAlpha('Solo se permiten letras.')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
  }
)
router.get('/', getAllEntrys)
router.get(
  '/:id',
  getEntryById,
  [
    param('id')
      .trim()
      .notEmpty()
      .withMessage('El id es obligatorio.')
      .isNumeric()
      .withMessage('El id debe contener solo números.')
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
  updateEntry,
  [
    param('id')
      .trim()
      .notEmpty()
      .withMessage('El id es obligatorio.')
      .isNumeric()
      .withMessage('El id debe contener solo números.')
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
  deleteEntry,
  [
    param('id')
      .trim()
      .notEmpty()
      .withMessage('El id es obligatorio.')
      .isNumeric()
      .withMessage('El id debe contener solo números.')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
  }
)
router.get(
  '/search/:product_type',
  searchEntryByProductType,
  [
    param('product_type')
      .trim()
      .notEmpty()
      .withMessage('El término de búsqueda es obligatorio.')
      .isAlphanumeric()
      .withMessage(
        'El término de búsqueda solo puede contener letras y números.'
      )
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
  }
)

router.get(
  '/search/:receipt_code',
  searchEntryByReceiptCode,
  [
    param('receipt_code')
      .trim()
      .notEmpty()
      .withMessage('El término de búsqueda es obligatorio.')
      .isAlphanumeric()
      .withMessage(
        'El término de búsqueda solo puede contener letras y números.'
      )
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
  }
)

router.get(
  '/search/:delivery_company',
  searchEntryByDeliveryCompany,
  [
    param('delivery_company')
      .trim()
      .notEmpty()
      .withMessage('El término de búsqueda es obligatorio.')
      .isAlphanumeric()
      .withMessage(
        'El término de búsqueda solo puede contener letras y números.'
      )
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
  }
)
router.get(
  '/search/:entry_date',
  searchEntryByDate,
  [
    param('entry_date')
      .trim()
      .notEmpty()
      .withMessage('El término de búsqueda es obligatorio.')
      .isAlphanumeric()
      .withMessage(
        'El término de búsqueda solo puede contener letras y números.'
      )
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
  }
)
router.get(
  '/search/:status',
  searchEntryByStatus,
  [
    param('status')
      .trim()
      .notEmpty()
      .withMessage('El status es obligatorio.')
      .isAlpha('Solo se permiten letras.')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
  }
)
router.get(
  '/search/:admin_dni',
  searchEntryByAdmin,
  [
    param('admin_dni')
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

export default router
