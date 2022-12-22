import express from "express"
import {getMedias,getMedia,postMedia,putMedia,deleteMedia} from '../controllers/mediaController.js'
const router = express.Router()

router.get('/', getMedias)
router.post('/', postMedia)
router.get('/:id', getMedia)
router.put('/:id', putMedia)
router.delete('/:id',deleteMedia)
export default router