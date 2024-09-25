import { Router } from 'express'
import {
  createAdmin,
  deleteAdmin,
  getAdmin,
  loginAdmin,
  updateAdmin
} from '../controller/adminController.js'

const router = Router()

router.post('/', createAdmin)
router.post('/login', loginAdmin)
router.get('/:dni', getAdmin)
router.put('/:dni', updateAdmin)
router.delete('/:dni', deleteAdmin)

export default router
