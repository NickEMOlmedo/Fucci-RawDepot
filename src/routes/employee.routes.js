import { Router } from 'express'
import {
  register,
  login,
  getEmployee,
  deleteEmployee,
  updateEmployee
} from '../controller/employeeController.js'
const router = Router()

router.post('/employee/register', register)
router.post('/employee/login', login)
router.get('/employee/:dni', getEmployee)
router.put('/employee/:dni', updateEmployee)
router.delete('/employee/:dni', deleteEmployee)
export default router
