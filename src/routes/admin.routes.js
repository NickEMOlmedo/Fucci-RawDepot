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

const router = Router()

router.post('/', createAdmin)
router.post('/login', loginAdmin)
router.get('/', getAllAdmins)
router.get('/:dni', getAdminByDni)
router.get('/:id', getAdminById)
router.put('/:id', updateAdmin)
router.delete('/:id', deleteAdmin)

export default router
