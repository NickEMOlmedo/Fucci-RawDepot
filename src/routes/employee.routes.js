import { Router } from 'express'
import {
  getEmployee,
  deleteEmployee,
  updateEmployee,
  createEmployee,
  loginEmployee
} from '../controller/employeeController.js'

const router = Router()

router.post('/', createEmployee)
router.post('/login', loginEmployee)
router.get('/:dni', getEmployee)
router.put('/:dni', updateEmployee)
router.delete('/:dni', deleteEmployee)

export default router
