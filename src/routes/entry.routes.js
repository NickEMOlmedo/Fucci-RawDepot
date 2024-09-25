import { Router } from 'express'
import {
  createEntry,
  deleteEntry,
  getAllEntrys,
  getEntryById,
  searchEntryByAdmin,
  searchEntryByDate,
  searchEntryByDeliveryCompany,
  searchEntryByProductType,
  searchEntryByStatus,
  updateEntry
} from '../controller/entryController.js'

const router = Router()

router.post('/', createEntry)
router.get('/', getAllEntrys)
router.get('/:id', getEntryById)
router.put('/', updateEntry)
router.delete('/:id', deleteEntry)
router.get('/search/:product_type', searchEntryByProductType)
router.get('/search/:delivery_company', searchEntryByDeliveryCompany)
router.get('/search/:entry_date', searchEntryByDate)
router.get('/search/:status', searchEntryByStatus)
router.get('/search/:admin_dni', searchEntryByAdmin)

export default router