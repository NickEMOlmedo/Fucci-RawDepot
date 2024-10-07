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
      .notEmpty()
      .withMessage('La fecha de entrada es obligatoria.')
      .isISO8601()
      .withMessage('Formato de fecha invalido.')
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
    createEntry(req, res)
  }
)
router.get('/', getAllEntrys)
router.get(
  '/:id',
  [
    param('id')
      .trim()
      .notEmpty()
      .withMessage('El ID es obligatorio.')
      .isNumeric()
      .withMessage('El ID debe contener solo números.')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    getEntryById(req, res)
  }
)
router.put(
  '/:id',
  [
    param('id')
      .trim()
      .notEmpty()
      .withMessage('El ID es obligatorio.')
      .isNumeric()
      .withMessage('El ID debe contener solo números.')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    updateEntry(req, res)
  }
)
router.delete(
  '/:id',
  [
    param('id')
      .trim()
      .notEmpty()
      .withMessage('El ID es obligatorio.')
      .isNumeric()
      .withMessage('El ID debe contener solo números.')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    deleteEntry(req, res)
  }
)
router.get(
  '/search/:product_type',
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
    searchEntryByProductType(req, res)
  }
)

router.get(
  '/search/:receipt_code',
  [
    param('receipt_code')
      .trim()
      .notEmpty()
      .withMessage('El codigo de remito es obligatorio.')
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
    searchEntryByReceiptCode(req, res)
  }
)

router.get(
  '/search/:delivery_company',
  [
    param('delivery_company')
      .trim()
      .notEmpty()
      .withMessage('La compañia de envio es obligatoria.')
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
    searchEntryByDeliveryCompany(req, res)
  }
)
router.get(
  '/search/:entry_date',
  [
    param('entry_date')
      .notEmpty()
      .withMessage('La fecha de entrada es obligatoria.')
      .isISO8601()
      .withMessage('Formato de fecha invalido.')
      .toDate()
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    searchEntryByDate(req, res)
  }
)
router.get(
  '/search/:status',
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
    searchEntryByStatus(req, res)
  }
)
router.get(
  '/search/:admin_dni',
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
    searchEntryByAdmin(req, res)
  }
)

export default router
