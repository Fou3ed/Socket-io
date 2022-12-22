import express from "express"
import {GetMembers,getMember,postMember,putMember,deleteMember} from '../controllers/convMemberController.js'
const router = express.Router()

router.get('/', GetMembers)
router.post('/', postMember)
router.get('/:id', getMember)
router.put('/:id', putMember)
router.delete('/:id', deleteMember)
export default router