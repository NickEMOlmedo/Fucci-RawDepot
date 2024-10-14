import { Router } from 'express'
import { body, param, validationResult } from 'express-validator'
import { verifyAdmin } from '../middleware/verifyAdmin.js'
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProductByName,
  searchProductByBrand,
  searchProductByPresentation
} from '../controller/productController.js'

const router = Router()

router.post(
  '/',
  verifyAdmin,
  [
    body('name')
      .notEmpty()
      .withMessage('El nombre es obligatorio.')
      .bail()
      .trim()
      .isAlpha()
      .withMessage('El nombre solo puede contener letras.')
      .isLength({ min: 3 })
      .withMessage('El nombre debe tener al menos 3 caracteres.'),
    body('brand')
      .notEmpty()
      .withMessage('La marca del producto es obligatoria.')
      .bail()
      .trim()
      .isAlphanumeric()
      .withMessage('La marca solo puede contener letras y numeros.')
      .isLength({ min: 3 })
      .withMessage('La marca debe tener al menos 3 caracteres.'),
    body('manufacturer')
      .notEmpty()
      .withMessage('El nombre del fabricante no puede estar vacio.')
      .bail()
      .trim()
      .isAlphanumeric()
      .withMessage(
        'El nombre del fabricante solo puede contener letras y numeros.'
      )
      .isLength({ min: 3 })
      .withMessage(
        'El nombre del fabricante debe tener al menos 3 caracteres.'
      ),
    body('presentation')
      .notEmpty()
      .withMessage('La presentacion del producto no puede estar vacia.')
      .bail()
      .trim()
      .matches(/^[a-zA-Z0-9.,\s]+$/)
      .withMessage(
        'La presentacion solo permite letras, números, puntos y comas.'
      )
      .isLength({ min: 3 })
      .withMessage('La presentacion debe tener al menos 3 caracteres.'),
    body('quality')
      .notEmpty()
      .withMessage('La calidad del producto es obligatoria.')
      .bail()
      .trim()
      .isAlpha()
      .withMessage('Solo se permiten letras en la calidad.')
      .isLength({ min: 3 })
      .withMessage('La calidad debe tener al menos 3 caracteres.'),
    body('stock')
      .notEmpty()
      .withMessage('El stock es obligatorio')
      .bail()
      .trim()
      .isInt()
      .withMessage('El stock solo permite numeros.')
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
    createProduct(req, res)
  }
)
router.get('/', getAllProducts)
router.get(
  '/:id',
  [
    param('id')
      .notEmpty()
      .withMessage('El ID del producto es obligatorio.')
      .bail()
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
    getProductById()
  }
)
router.put(
  '/:id',
  verifyAdmin,
  [
    param('id')
      .notEmpty()
      .withMessage('El ID del producto es obligatorio.')
      .bail()
      .trim()
      .isInt()
      .withMessage('El ID del producto debe ser un valor numerico.'),
    body('name')
      .optional()
      .trim()
      .isAlpha()
      .withMessage('El nombre solo puede contener letras.')
      .isLength({ min: 3 })
      .withMessage('El nombre debe tener al menos 3 caracteres.'),
    body('brand')
      .optional()
      .trim()
      .isAlphanumeric()
      .withMessage('La marca solo puede contener letras y numeros.')
      .isLength({ min: 3 })
      .withMessage('La marca debe tener al menos 3 caracteres.'),
    body('manufacturer')
      .optional()
      .trim()
      .isAlphanumeric()
      .withMessage(
        'El nombre del fabricante solo puede contener letras y numeros.'
      )
      .isLength({ min: 3 })
      .withMessage(
        'El nombre del fabricante debe tener al menos 3 caracteres.'
      ),
    body('presentation')
      .optional()
      .trim()
      .matches(/^[a-zA-Z0-9.,\s]+$/)
      .withMessage(
        'La presentacion solo permite letras, números, puntos y comas.'
      )
      .isLength({ min: 3 })
      .withMessage('La presentacion debe tener al menos 3 caracteres.'),
    body('quality')
      .optional()
      .trim()
      .isAlpha()
      .withMessage('Solo se permiten letras en la calidad.')
      .isLength({ min: 3 })
      .withMessage('La calidad debe tener al menos 3 caracteres.'),
    body('stock')
      .optional()
      .trim()
      .isInt()
      .withMessage('El stock solo permite numeros.')
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
    updateProduct(req, res)
  }
)
router.delete(
  '/:id',
  verifyAdmin,
  [
    param('id')
      .notEmpty()
      .withMessage('El ID del producto es obligatorio.')
      .bail()
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
    deleteProduct(req, res)
  }
)
router.get(
  '/search/name/:name',
  [
    param('name')
      .notEmpty()
      .withMessage('El nombre del producto es obligatorio.')
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
    searchProductByName(req, res)
  }
)
router.get(
  '/search/brand/:brand',
  [
    param('brand')
      .notEmpty()
      .withMessage('La marca es obligatoria.')
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
    searchProductByBrand(req, res)
  }
)
router.get(
  '/search/presentation/:presentation',
  [
    param('presentation')
      .notEmpty()
      .withMessage('La presentacion es obligatoria.')
      .bail()
      .trim()
      .matches(/^[a-zA-Z0-9.,\s]+$/)
      .withMessage(
        'La presentacion solo permite letras, números, puntos y comas.'
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
    searchProductByPresentation(req, res)
  }
)

export default router
