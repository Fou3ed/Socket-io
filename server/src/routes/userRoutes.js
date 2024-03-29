import express from "express"
import {
    getUsers,
    getUser,
    postUser,
    putUser,
    deleteUser,
    getUserStatus,
    getUsersOnline,
    banUser,
    unbanUser,
    registerUser,
    getUserName
} from '../controllers/userController.js'
const router = express.Router()

router.get('/', getUsers)
router.post('/', postUser)
router.get('/:id', getUser)
router.get('/userName/query',getUserName)
router.put('/:id', putUser)
router.put('/ban/:id', banUser)
router.put('/unban/:id', unbanUser)
router.get('/status/:id', getUserStatus)
router.get('/online/users', getUsersOnline)
router.delete('/:id', deleteUser)
router.get ('/login',registerUser)

export default router