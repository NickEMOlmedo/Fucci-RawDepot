import { Router } from 'express'
import { register, login } from '../controller/accesControllerEmployee.js'
const router = Router()

router.post('/register', register)
router.post('/login', login)

export default router
