import { Router } from 'express'
import { body, param, validationResult } from 'express-validator'
import {
  createLot,
  deleteLot,
  getAllLots,
  getLotById,
  searchLotByExpirationDate,
  searchLotByNum,
  searchLotByProduct,
  updateLot
} from '../controller/lotController.js'

const router = Router()

router.post(
  '/',
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
      .isISO8601()
      .withMessage('La fecha debe ser una fecha válida.')
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
    createLot(req, res)
  }
)
router.get('/', getAllLots)
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
router.put(
  '/:id',
  [
    param('id')
      .isEmpty()
      .withMessage('El ID del lote es obligatorio.')
      .bail()
      .trim()
      .isInt()
      .withMessage('El ID del producto debe ser un valor numerico.'),
    body('lotNumber')
      .optional()
      .trim()
      .isAlphanumeric()
      .withMessage('El numero de lote solo permite letras o numeros.')
      .isLength({ min: 3, max: 30 })
      .withMessage('El largo debe estar entre 3 y 30 digitos.'),
    body('expirationDate')
      .optional()
      .isISO8601()
      .withMessage('La fecha debe ser una fecha válida.')
      .toDate(),
    body('quantity')
      .optional()
      .trim()
      .isInt()
      .withMessage('La cantidad debe ser un valor numerico.'),
    body('productId')
      .optional()
      .trim()
      .isInt()
      .withMessage('El ID del producto debe ser un valor numerico.')
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
    updateLot(req, res)
  }
)
router.delete(
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
    deleteLot(req, res)
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
      .isISO8601()
      .withMessage('Formato de termino de busqueda invalido.')
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
    searchLotByExpirationDate(req, res)
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
      .withMessage('El termino de busqueda debe ser un valor numerico.')
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

export default router
