import express from "express"
import getConnection from '../controllers/connectionController.js'
const router = express.Router()

router.get('/', getConnection)

export default router