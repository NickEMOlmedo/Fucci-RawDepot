import { Router } from 'express'
import {
  deleteWithdrawal,
  getAllWithdrawals,
  getWithdrawalBydId,
  searchWithdrawalWithAdmin,
  searchWithdrawalWithDate,
  searchWithdrawalWithEmployee,
  updateWithdrawal,
  uploadWithdrawal
} from '../controller/withdrawalController'
export const router = Router()

router.post('/', uploadWithdrawal)
router.get('/', getAllWithdrawals)
router.get('/:id', getWithdrawalBydId)
router.put('/:id', updateWithdrawal)
router.delete('/:id', deleteWithdrawal)
router.get('/search/:withdrawal_date', searchWithdrawalWithDate)
router.get('/search/:employee_dni', searchWithdrawalWithEmployee)
router.get('/search/:admin_dni', searchWithdrawalWithAdmin)
