import { Router } from 'express'
import { body, param, query, validationResult } from 'express-validator'
import { verifyAdmin } from '../middleware/verifyAdmin.js'
import { verifySuperAdmin } from '../middleware/verifySuperAdmin.js'
import {
  createEntry,
  deleteEntry,
  getAllEntrys,
  getEntryById,
  searchEntryByAdmin,
  searchEntryByDate,
  searchEntryByDateRange,
  searchEntryByDeliveryCompany,
  searchEntryByProductId,
  searchEntryByReceiptCode,
  searchEntryByStatus,
  updateEntry
} from '../controller/entryController.js'

const router = Router()

router.post(
  '/',
  [
    body('productId')
      .notEmpty()
      .withMessage('EL ID es obligatorio.')
      .bail()
      .trim()
      .isInt()
      .withMessage('El id del producto debe ser numerico.'),
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
      .withMessage('El status solo permite letras.'),
    body('adminId')
      .notEmpty()
      .withMessage('El id del admin es obligatorio.')
      .bail()
      .trim()
      .isInt()
      .withMessage('El id del admin debe ser numerico')
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
router.get(
  '/',
  verifyAdmin,
  [
    query('skip')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Skip debe ser un número entero positivo.'),
    query('take')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Take debe ser un número entero entre 1 y 100.')
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
    getAllEntrys(req, res)
  }
)
router.get(
  '/:id',
  verifyAdmin,
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
  verifyAdmin,
  [
    param('id')
      .notEmpty()
      .withMessage('El ID es obligatorio.')
      .bail()
      .trim()
      .isInt()
      .withMessage('El ID debe contener solo números.'),
    body('productId')
      .optional()
      .trim()
      .isInt()
      .withMessage('El id del producto debe ser numerico.'),
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
    body('quantity')
      .optional()
      .trim()
      .isInt()
      .withMessage('Solo se permiten numeros.'),
    body('status')
      .optional()
      .trim()
      .isAlpha()
      .withMessage('El status solo permite letras.'),
    body('adminId')
      .optional()
      .trim()
      .isInt()
      .withMessage('El id del admin debe ser numerico.')
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
  verifyAdmin,
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
  '/search/product_id/:product_id',
  verifyAdmin,
  [
    param('product_id')
      .notEmpty()
      .withMessage('El término de búsqueda es obligatorio.')
      .trim()
      .bail()
      .isInt()
      .withMessage('El término de búsqueda solo puede contener números.'),
    query('skip')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Skip debe ser un número entero positivo.'),
    query('take')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Take debe ser un número entero entre 1 y 100.')
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
    searchEntryByProductId(req, res)
  }
)

router.get(
  '/search/receipt_code/:receipt_code',
  verifyAdmin,
  [
    param('receipt_code')
      .notEmpty()
      .withMessage('El termino de busqueda es obligatorio.')
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
  '/search/delivery_company/:delivery_company',
  verifyAdmin,
  [
    param('delivery_company')
      .notEmpty()
      .withMessage('El termino de busqueda es obligatorio.')
      .trim()
      .bail()
      .isAlphanumeric()
      .withMessage(
        'El término de búsqueda solo puede contener letras y números.'
      ),
    query('skip')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Skip debe ser un número entero positivo.'),
    query('take')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Take debe ser un número entero entre 1 y 100.')
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
  '/search/entry_date/:entry_date',
  [
    param('entry_date')
      .notEmpty()
      .withMessage('El termino de busqueda es obligatorio.')
      .bail()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Formato de fecha inválido. Usa YYYY-MM-DD.')
      .toDate(),
    query('skip')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Skip debe ser un número entero positivo.'),
    query('take')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Take debe ser un número entero entre 1 y 100.')
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
  '/search/entrydate_byrange',
  [
    query('skip')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Skip debe ser un número entero positivo.'),
    query('take')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Take debe ser un número entero entre 1 y 100.'),
    body('entryDate_start')
      .notEmpty()
      .withMessage('El termino de busqueda es obligatorio.')
      .bail()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Formato de fecha inválido. Usa YYYY-MM-DD.')
      .toDate(),
    body('entryDate_end')
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
    searchEntryByDateRange(req, res)
  }
)
router.get(
  '/search/status/:status',
  [
    query('skip')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Skip debe ser un número entero positivo.'),
    query('take')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Take debe ser un número entero entre 1 y 100.'),
    param('status')
      .notEmpty()
      .withMessage('El termino de busqueda es obligatorio.')
      .bail()
      .trim()
      .isAlpha()
      .withMessage('El termino de busqueda debe contener solo letras.')
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
  '/search/admin_id/:admin_id',
  [
    query('skip')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Skip debe ser un número entero positivo.'),
    query('take')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Take debe ser un número entero entre 1 y 100.'),
    param('admin_id')
      .notEmpty()
      .withMessage('El termino de busqueda es obligatorio')
      .bail()
      .trim()
      .isInt()
      .withMessage('El termino de busqueda debe contener solo números.')
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
