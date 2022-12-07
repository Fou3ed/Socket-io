import express from "express"
import {getRoles,getRole,postUser,putRole,deleteRole} from '../controllers/roleController.js'
const router = express.Router()

router.get('/', getRoles)
router.post('/', postUser)
router.get('/:id', getRole)
router.put('/:id', putRole)
router.delete('/:id',deleteRole)
export default router