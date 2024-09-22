import { Router } from 'express'
import {
  getAllWithdrawalDetails,
  getWithdrawalDetailWithId,
  searchWithdrawalDetailWithProduct,
  searchWithdrawalDetailWithStatus,
  uploadWithdrawalDetail
} from '../controller/withdrawalDetailController'
export const router = Router()

router.post('/', uploadWithdrawalDetail)
router.get('/', getAllWithdrawalDetails)
router.get('/:id', getWithdrawalDetailWithId)
router.get('/search/:status', searchWithdrawalDetailWithStatus)
router.get('/search/:product_id', searchWithdrawalDetailWithProduct)
