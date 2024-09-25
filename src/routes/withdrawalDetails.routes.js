import { Router } from 'express'
import {
  createWithdrawalDetail,
  getAllWithdrawalDetails,
  getWithdrawalDetailWithId,
  searchWithdrawalDetailWithProduct,
  searchWithdrawalDetailWithStatus,
  updateWithdrawalDetail
} from '../controller/withdrawalDetailController.js'

const router = Router()

router.post('/', createWithdrawalDetail)
router.get('/', getAllWithdrawalDetails)
router.get('/:id', getWithdrawalDetailWithId)
router.put('/:id', updateWithdrawalDetail)
router.get('/search/:status', searchWithdrawalDetailWithStatus)
router.get('/search/:product_id', searchWithdrawalDetailWithProduct)

export default router
