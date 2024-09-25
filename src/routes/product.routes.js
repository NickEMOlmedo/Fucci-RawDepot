import { Router } from 'express'
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

router.post('/', createProduct)
router.get('/', getAllProducts)
router.get('/:id', getProductById)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)
router.get('/search/:name', searchProductByName)
router.get('/search/:brand', searchProductByBrand)
router.get('/search/:presentation', searchProductByPresentation)

export default router
