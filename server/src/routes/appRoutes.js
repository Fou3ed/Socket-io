import express from "express"
import {getApps, 
    deleteAPP,
    getAppById,
    postApps,
    putApp
} from '../controllers/appController.js'
const router = express.Router()

router.get('/', getApps)
router.post('/', postApps)
router.get('/:id', getAppById)
router.put('/:id', putApp)
router.delete('/:id', deleteAPP)
export default router