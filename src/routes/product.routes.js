import { Router } from 'express'
import { body, param, validationResult } from 'express-validator'
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
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('El nombre es obligatorio.')
      .isAlpha()
      .withMessage('El nombre solo puede contener letras.')
      .isLength({ min: 3 })
      .withMessage('El nombre debe tener al menos 3 caracteres.'),
    body('brand')
      .trim()
      .notEmpty()
      .withMessage('La marca del producto es obligatoria.')
      .isAlphaNumeric()
      .withMessage('La marca solo puede contener letras y numeros.')
      .isLength({ min: 3 })
      .withMessage('La marca debe tener al menos 3 caracteres.'),
    body('manufacturer')
      .trim()
      .notEmpty()
      .withMessage('El nombre del fabricante no puede estar vacio.')
      .isAlphaNumeric()
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
      .isAlphaNumeric()
      .withMessage('La presentacion solo puede contener letras y numeros.')
      .isLength({ min: 3 })
      .withMessage('La presentacion debe tener al menos 3 caracteres.'),
    body('quality')
      .trim()
      .notEmpty()
      .withMessage('La calidad del producto es obligatoria.')
      .isAlpha()
      .withMessage('Solo se permiten letras en la calidad.')
      .isLength({ min: 3 })
      .withMessage('La calidad debe tener al menos 3 caracteres.'),
    body('stock').trim().notEmpty('El stock es obligatorio')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
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
      .withMessage('La id del producto es obligatorio.')
      .isNumeric()
      .withMessage('El id del producto debe ser un valor numerico.')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    getProductById()
  }
)
router.put(
  '/:id',
  [
    param('id')
      .trim()
      .notEmpty()
      .withMessage('La id del producto es obligatorio.')
      .isNumeric()
      .withMessage('El id del producto debe ser un valor numerico.'),
    body('name')
      .trim()
      .notEmpty()
      .withMessage('El nombre es obligatorio.')
      .isAlpha()
      .withMessage('El nombre solo puede contener letras.')
      .isLength({ min: 3 })
      .withMessage('El nombre debe tener al menos 3 caracteres.'),
    body('brand')
      .trim()
      .notEmpty()
      .withMessage('La marca del producto es obligatoria.')
      .isAlphaNumeric()
      .withMessage('La marca solo puede contener letras y numeros.')
      .isLength({ min: 3 })
      .withMessage('La marca debe tener al menos 3 caracteres.'),
    body('manufacturer')
      .trim()
      .notEmpty()
      .withMessage('El nombre del fabricante no puede estar vacio.')
      .isAlphaNumeric()
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
      .isAlphaNumeric()
      .withMessage('La presentacion solo puede contener letras y numeros.')
      .isLength({ min: 3 })
      .withMessage('La presentacion debe tener al menos 3 caracteres.'),
    body('quality')
      .trim()
      .notEmpty()
      .withMessage('La calidad del producto es obligatoria.')
      .isAlpha()
      .withMessage('Solo se permiten letras en la calidad.')
      .isLength({ min: 3 })
      .withMessage('La calidad debe tener al menos 3 caracteres.'),
    body('stock').trim().notEmpty('El stock es obligatorio')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    updateProduct(req, res)
  }
)
router.delete(
  '/:id',
  [
    param('id')
      .trim()
      .notEmpty()
      .withMessage('La id del producto es obligatorio.')
      .isNumeric()
      .withMessage('El id del producto debe ser un valor numerico.')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
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
      .isAlpha('Solo se permiten letras.')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
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
      .isAlpha('Solo se permiten letras.')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
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
      .isAlpha('Solo se permiten letras.')
  ],
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    searchProductByPresentation(req, res)
  }
)

export default router
