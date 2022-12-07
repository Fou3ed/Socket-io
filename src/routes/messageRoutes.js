import express from "express"
import {GetMessages,getMessage,postMessage,putMessage,deleteMessage} from '../controllers/messagesController.js'
const router = express.Router()

router.get('/', GetMessages)
router.post('/', postMessage)
router.get('/:id', getMessage)
router.put('/:id', putMessage)
router.delete('/:id',deleteMessage)
export default router