import { Router } from 'express'
import {
  uploadProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProduct
} from '../controller/productController.js'

export const router = Router()

router.post('/', uploadProduct)
router.get('/', getAllProducts)
router.get('/:id', getProductById)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)
router.get('/search/:name', searchProduct)

export default router
