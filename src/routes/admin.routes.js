import { Router } from 'express'
import {
  createAdmin,
  deleteAdmin,
  getAdminByDni,
  getAdminById,
  getAllAdmins,
  loginAdmin,
  updateAdmin
} from '../controller/adminController.js'
import { logoutAllUsers } from '../middleware/logoutAllUsers.js'

const router = Router()

router.post('/', createAdmin)
router.post('/auth/login', loginAdmin)
router.post('/auth/logout', logoutAllUsers)
router.get('/', getAllAdmins)
router.get('/dni/:dni', getAdminByDni)
router.get('/id/:id', getAdminById)
router.put('/:id', updateAdmin)
router.delete('/:id', deleteAdmin)

export default router
