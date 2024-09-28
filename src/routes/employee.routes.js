import { Router } from 'express'
import {
  deleteEmployee,
  updateEmployee,
  createEmployee,
  loginEmployee,
  getAllEmployees,
  getEmployeeByDni,
  getEmployeeById
} from '../controller/employeeController.js'

const router = Router()

router.post('/', createEmployee)
router.post('/login', loginEmployee)
router.get('/', getAllEmployees)
router.get('/:dni', getEmployeeByDni)
router.get('/:id', getEmployeeById)
router.put('/:id', updateEmployee)
router.delete('/:id', deleteEmployee)

export default router
