import express from "express"
import {
    GetMessages,
    getMessage,
    postMessage,
    putMessage,
    deleteMessage,
    MarkMessageAsRead,
    GetUnreadMessages,
    markMessageAsDelivered,
    GetUnreadMessagesCount
} from '../controllers/messagesController.js'
const router = express.Router()

router.get('/', GetMessages)
router.post('/', postMessage)
router.get('/:id', getMessage)
router.put('/:id', putMessage)
router.put('/read/:id', MarkMessageAsRead)
router.put('/delivered/:id', markMessageAsDelivered)
router.get('/unread/messages/', GetUnreadMessages)
router.get('/unread/messages/count', GetUnreadMessagesCount)

router.delete('/:id', deleteMessage)
export default router