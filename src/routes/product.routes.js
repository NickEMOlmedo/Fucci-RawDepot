import { Router } from 'express'
import { body, param, query, validationResult } from 'express-validator'
import { verifyAdmin } from '../middleware/verifyAdmin.js'
import { verifySuperAdmin } from '../middleware/verifySuperAdmin.js'
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
    getAllProducts(req, res)
  }
)
router.get(
  '/:id',
  [
    param('id')
      .notEmpty()
      .withMessage('El ID es obligatorio.')
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
    getProductById(req, res)
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
      .withMessage('El ID es obligatorio.')
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
    query('skip')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Skip debe ser un número entero positivo.'),
    query('take')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Take debe ser un número entero entre 1 y 100.'),
    param('name')
      .notEmpty()
      .withMessage('El termino de busqueda es obligatorio.')
      .bail()
      .trim()
      .isAlpha()
      .withMessage('EL termino de busqueda solo permite letras.')
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
    query('skip')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Skip debe ser un número entero positivo.'),
    query('take')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Take debe ser un número entero entre 1 y 100.'),
    param('brand')
      .notEmpty()
      .withMessage('El termino de busqueda es obligatorio.')
      .bail()
      .trim()
      .isAlpha()
      .withMessage('El termino de busqueda solo permite letras.')
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
    query('skip')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Skip debe ser un número entero positivo.'),
    query('take')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Take debe ser un número entero entre 1 y 100.'),
    param('presentation')
      .notEmpty()
      .withMessage('El termino de busqueda es obligatorio.')
      .bail()
      .trim()
      .matches(/^[a-zA-Z0-9.,\s]+$/)
      .withMessage(
        'El termino de busqueda solo permite letras, números, puntos y comas.'
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
