import { Router } from 'express'
import { register, login } from '../controller/employeeController.js'
const router = Router()

router.post('/employee/register', register)
router.post('/employee/login', login)

export default router
