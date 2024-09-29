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
import { logoutAllUsers } from '../middleware/logoutAllUsers.js'

const router = Router()

router.post('/', createEmployee)
router.post('/auth/login', loginEmployee)
router.post('/auth/logout', logoutAllUsers)
router.get('/', getAllEmployees)
router.get('/dni/:dni', getEmployeeByDni)
router.get('/id/:id', getEmployeeById)
router.put('/:id', updateEmployee)
router.delete('/:id', deleteEmployee)

export default router
