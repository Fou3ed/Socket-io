import express from "express"
import {getUsers,getUser,postUser,putUser,deleteUser} from '../controllers/userController.js'
const router = express.Router()

router.get('/', getUsers)
router.post('/', postUser)
router.get('/:id', getUser)
router.put('/:id', putUser)
router.delete('/:id', deleteUser)
export default router