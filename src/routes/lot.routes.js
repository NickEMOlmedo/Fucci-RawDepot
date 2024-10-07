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
      .trim()
      .notEmpty()
      .withMessage('El numero de lote no puede estar vacio')
      .isAlphanumeric()
      .withMessage('El numero de lote solo permite letras o numeros.')
      .isLength({ min: 3, max: 30 })
      .withMessage('El largo debe estar entre 3 y 30 digitos.'),
    body('expirationDate')
      .notEmpty()
      .withMessage('La fecha de entrada es obligatoria.')
      .isISO8601()
      .withMessage('La fecha debe ser una fecha válida.')
      .toDate(),
    body('quantity')
      .trim()
      .notEmpty()
      .withMessage('La cantidad es obligatoria.')
      .isNumeric()
      .withMessage('La cantidad debe ser un valor numerico.'),
    body('productId')
      .trim()
      .notEmpty()
      .withMessage('El id del producto es obligatorio.')
      .isNumeric()
      .withMessage('El id del producto debe ser un valor numerico.')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    createLot(req, res)
  }
)
router.get('/', getAllLots)
router.get(
  '/:id',
  [
    param('id')
      .trim()
      .notEmpty()
      .withMessage('El ID del lote es obligatorio.')
      .isNumeric()
      .withMessage('El ID del lote debe ser un valor numerico.')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    getLotById()
  }
)
router.put(
  '/:id',
  [
    param('id')
      .trim()
      .isEmpty()
      .withMessage('El ID del lote es obligatorio.')
      .isNumeric()
      .withMessage('El ID del producto debe ser un valor numerico.'),
    body('lotNumber')
      .trim()
      .notEmpty()
      .withMessage('El numero de lote no puede estar vacio')
      .isAlphanumeric()
      .withMessage('El numero de lote solo permite letras o numeros.')
      .isLength({ min: 3, max: 30 })
      .withMessage('El largo debe estar entre 3 y 30 digitos.'),
    body('expirationDate')
      .isEmpty()
      .withMessage('La fecha de entrada es obligatoria.')
      .isISO8601()
      .withMessage('La fecha debe ser una fecha válida.')
      .toDate(),
    body('quantity')
      .trim()
      .isEmpty()
      .withMessage('La cantidad es obligatoria.')
      .isNumeric()
      .withMessage('La cantidad debe ser un valor numerico.'),
    body('productId')
      .trim()
      .isEmpty()
      .withMessage('El ID del producto es obligatorio.')
      .isNumeric()
      .withMessage('El ID del producto debe ser un valor numerico.')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    updateLot(req, res)
  }
)
router.delete(
  '/:id',
  [
    param('id')
      .trim()
      .isEmpty()
      .withMessage('El ID del lote es obligatorio.')
      .isNumeric()
      .withMessage('El ID del lote debe ser un valor numerico.')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    deleteLot(req, res)
  }
)
router.get(
  '/search/:lot_number',
  [
    param('lot_number')
      .trim()
      .notEmpty()
      .withMessage('El numero de lote no puede estar vacio')
      .isAlphanumeric()
      .withMessage('El numero de lote solo permite letras o numeros.')
      .isLength({ min: 3, max: 30 })
      .withMessage('El largo debe estar entre 3 y 30 digitos.')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    searchLotByNum(req, res)
  }
)
router.get(
  '/search/:expiration_date',
  [
    param('expiration_date')
      .isEmpty()
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
    searchLotByExpirationDate(req, res)
  }
)
router.get(
  '/search/:product_id',
  [
    param('id')
      .trim()
      .isEmpty()
      .withMessage('El ID del producto es obligatorio.')
      .isNumeric()
      .withMessage('El ID del producto debe ser un valor numerico.')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    searchLotByProduct(req, res)
  }
)

export default router
