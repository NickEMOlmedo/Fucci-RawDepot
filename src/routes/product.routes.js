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
      .trim()
      .notEmpty()
      .withMessage('El nombre es obligatorio.')
      .bail()
      .isAlpha()
      .withMessage('El nombre solo puede contener letras.')
      .isLength({ min: 3 })
      .withMessage('El nombre debe tener al menos 3 caracteres.'),
    body('brand')
      .trim()
      .notEmpty()
      .withMessage('La marca del producto es obligatoria.')
      .bail()
      .isAlphanumeric()
      .withMessage('La marca solo puede contener letras y numeros.')
      .isLength({ min: 3 })
      .withMessage('La marca debe tener al menos 3 caracteres.'),
    body('manufacturer')
      .trim()
      .notEmpty()
      .withMessage('El nombre del fabricante no puede estar vacio.')
      .bail()
      .isAlphanumeric()
      .withMessage(
        'El nombre del fabricante solo puede contener letras y numeros.'
      )
      .isLength({ min: 3 })
      .withMessage(
        'El nombre del fabricante debe tener al menos 3 caracteres.'
      ),
    body('presentation')
      .trim()
      .notEmpty()
      .withMessage('La presentacion del producto no puede estar vacia.')
      .bail()
      .isAlphanumeric()
      .withMessage('La presentacion solo puede contener letras y numeros.')
      .isLength({ min: 3 })
      .withMessage('La presentacion debe tener al menos 3 caracteres.'),
    body('quality')
      .trim()
      .notEmpty()
      .withMessage('La calidad del producto es obligatoria.')
      .bail()
      .isAlpha()
      .withMessage('Solo se permiten letras en la calidad.')
      .isLength({ min: 3 })
      .withMessage('La calidad debe tener al menos 3 caracteres.'),
    body('stock')
      .trim()
      .notEmpty('El stock es obligatorio')
      .bail()
      .isNumeric()
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
      .trim()
      .notEmpty()
      .withMessage('El ID del producto es obligatorio.')
      .bail()
      .isNumeric()
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
      .trim()
      .notEmpty()
      .withMessage('El ID del producto es obligatorio.')
      .bail()
      .isNumeric()
      .withMessage('El ID del producto debe ser un valor numerico.'),
    body('name')
      .trim()
      .notEmpty()
      .withMessage('El nombre es obligatorio.')
      .bail()
      .isAlpha()
      .withMessage('El nombre solo puede contener letras.')
      .isLength({ min: 3 })
      .withMessage('El nombre debe tener al menos 3 caracteres.'),
    body('brand')
      .trim()
      .notEmpty()
      .withMessage('La marca del producto es obligatoria.')
      .bail()
      .isAlphanumeric()
      .withMessage('La marca solo puede contener letras y numeros.')
      .isLength({ min: 3 })
      .withMessage('La marca debe tener al menos 3 caracteres.'),
    body('manufacturer')
      .trim()
      .notEmpty()
      .withMessage('El nombre del fabricante no puede estar vacio.')
      .bail()
      .isAlphanumeric()
      .withMessage(
        'El nombre del fabricante solo puede contener letras y numeros.'
      )
      .isLength({ min: 3 })
      .withMessage(
        'El nombre del fabricante debe tener al menos 3 caracteres.'
      ),
    body('presentation')
      .trim()
      .notEmpty()
      .withMessage('La presentacion del producto no puede estar vacia.')
      .bail()
      .isAlphanumeric()
      .withMessage('La presentacion solo puede contener letras y numeros.')
      .isLength({ min: 3 })
      .withMessage('La presentacion debe tener al menos 3 caracteres.'),
    body('quality')
      .trim()
      .notEmpty()
      .withMessage('La calidad del producto es obligatoria.')
      .bail()
      .isAlpha()
      .withMessage('Solo se permiten letras en la calidad.')
      .isLength({ min: 3 })
      .withMessage('La calidad debe tener al menos 3 caracteres.'),
    body('stock')
      .trim()
      .notEmpty('El stock es obligatorio')
      .bail()
      .isNumeric()
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
      .trim()
      .notEmpty()
      .withMessage('El ID del producto es obligatorio.')
      .bail()
      .isNumeric()
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
  '/search/:name',
  [
    param('name')
      .trim()
      .notEmpty()
      .withMessage('El nombre del producto es obligatorio.')
      .bail()
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
  '/search/:brand',
  [
    param('brand')
      .trim()
      .notEmpty()
      .withMessage('La marca es obligatoria.')
      .bail()
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
  '/search/:presentation',
  [
    param('presentation')
      .trim()
      .notEmpty()
      .withMessage('La presentacion es obligatoria.')
      .bail()
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
    searchProductByPresentation(req, res)
  }
)

export default router
