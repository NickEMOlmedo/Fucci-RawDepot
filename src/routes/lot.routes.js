import { Router } from 'express'
import {
  deleteLot,
  getAllLots,
  getLotBydId,
  searchLotByExpirationDate,
  searchLotByNum,
  searchLotByProduct,
  updateLot,
  uploadLot
} from '../controller/lotController'
export const router = Router()

router.post('/', uploadLot)
router.get('/', getAllLots)
router.get('/', getLotBydId)
router.put('/:id', updateLot)
router.delete('/:id', deleteLot)
router.get('/search/:lot_number', searchLotByNum)
router.get('/search/:expiration_date', searchLotByExpirationDate)
router.get('/search/:product_id', searchLotByProduct)
