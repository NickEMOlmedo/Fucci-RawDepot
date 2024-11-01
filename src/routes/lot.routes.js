import { Router } from 'express'
import { body, param, query, validationResult } from 'express-validator'
import { verifyAdmin } from '../middleware/verifyAdmin.js'
import { verifySuperAdmin } from '../middleware/verifySuperAdmin.js'
import {
  comprobationHandler,
  getAllLots,
  getLotById,
  searchLotByExpirationDate,
  searchLotByExpirationDateRange,
  searchLotByNum,
  searchLotByProduct
} from '../controller/lotController.js'

const router = Router()

router.get(
  '/',
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
    getAllLots(req, res)
  }
)
router.get(
  '/:id',
  [
    param('id')
      .notEmpty()
      .withMessage('El ID del lote es obligatorio.')
      .bail()
      .trim()
      .isInt()
      .withMessage('El ID del lote debe ser un valor numerico.')
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
    getLotById(req, res)
  }
)
 
router.get(
  '/search/lot_number/:lot_number',
  [
    param('lot_number')
      .notEmpty()
      .withMessage('El termino de busqueda es obligatorio.')
      .bail()
      .trim()
      .isAlphanumeric()
      .withMessage('EL termino de busqueda solo permite letras o numeros.')
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
    searchLotByNum(req, res)
  }
)
router.get(
  '/search/expiration_date/:expiration_date',
  [
    param('expiration_date')
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
    searchLotByExpirationDate(req, res)
  }
)
router.get(
  '/search/expirationDate_byrange',
  [
    body('expirationDate_start')
      .notEmpty()
      .withMessage('El termino de busqueda es obligatorio.')
      .bail()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Formato de fecha inválido. Usa YYYY-MM-DD.')
      .toDate(),
    body('expirationDate_end')
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
    searchLotByExpirationDateRange(req, res)
  }
)
router.get(
  '/search/product_id/:product_id',
  [
    param('product_id')
      .notEmpty()
      .withMessage('El termino de busqueda es obligatorio.')
      .bail()
      .trim()
      .isInt()
      .withMessage('El termino de busqueda debe ser un valor numerico.'),
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
    searchLotByProduct(req, res)
  }
)

router.post(
  '/comprobationHandler',
  [
    body('lotNumber')
      .notEmpty()
      .withMessage('El numero de lote no puede estar vacio')
      .bail()
      .trim()
      .isAlphanumeric()
      .withMessage('El numero de lote solo permite letras o numeros.')
      .isLength({ min: 3, max: 30 })
      .withMessage('El largo debe estar entre 3 y 30 digitos.'),
    body('expirationDate')
      .notEmpty()
      .withMessage('La fecha de entrada es obligatoria.')
      .bail()
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Formato de fecha inválido. Usa YYYY-MM-DD.')
      .toDate(),
    body('quantity')
      .notEmpty()
      .withMessage('La cantidad es obligatoria.')
      .bail()
      .trim()
      .isInt()
      .withMessage('La cantidad debe ser un valor numerico.'),
    body('productId')
      .notEmpty()
      .withMessage('El id del producto es obligatorio.')
      .bail()
      .trim()
      .isInt()
      .withMessage('El id del producto debe ser un valor numerico.')
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
    comprobationHandler(req, res)
  }
)

export default router
