import { Router } from 'express'
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

router.post('/', createLot)
router.get('/', getAllLots)
router.get('/', getLotById)
router.put('/:id', updateLot)
router.delete('/:id', deleteLot)
router.get('/search/:lot_number', searchLotByNum)
router.get('/search/:expiration_date', searchLotByExpirationDate)
router.get('/search/:product_id', searchLotByProduct)

export default router
