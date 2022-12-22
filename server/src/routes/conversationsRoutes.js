import express from "express"
import {getConversations,getConversation,postConversation,putConversation,deleteConversation} from '../controllers/conversationsController.js'
const router = express.Router()

router.get('/', getConversations)
router.post('/', postConversation)
router.get('/:id', getConversation)
router.put('/:id', putConversation)
router.delete('/:id', deleteConversation)
export default router