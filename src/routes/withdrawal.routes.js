import { Router } from 'express'
import {
  createWithdrawal,
  deleteWithdrawal,
  getAllWithdrawals,
  getWithdrawalBydId,
  searchWithdrawalWithAdmin,
  searchWithdrawalWithDate,
  searchWithdrawalWithEmployee,
  updateWithdrawal
} from '../controller/withdrawalController.js'

const router = Router()

router.post('/', createWithdrawal)
router.get('/', getAllWithdrawals)
router.get('/:id', getWithdrawalBydId)
router.put('/:id', updateWithdrawal)
router.delete('/:id', deleteWithdrawal)
router.get('/search/:withdrawal_date', searchWithdrawalWithDate)
router.get('/search/:employee_dni', searchWithdrawalWithEmployee)
router.get('/search/:admin_dni', searchWithdrawalWithAdmin)

export default router
