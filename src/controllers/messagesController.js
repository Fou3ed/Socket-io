import message from '../models/messageModel.js'
import debug from "debug"
import Joi from "joi"
import validator from 'validator'
const logger = debug('namespace')


/**
 *  GetMessages :get get messages
 * @route /messages
 * @method Get 
 */
export const GetMessages = async (req, res) => {
    try {
        const result = await message.find();
        if (result.length > 0) {
            res.status(200).json({
                message: "success",
                data: result
            })
        } else {
            res.status(200).json({
                message: "success",
                data: "there are no such message "
            })
        }
    } catch (err) {
        logger(err)
        res.status(400).send({
            message: "fail retrieving data ",
        })
    }
}
/**
 * getMessage:get message data
 * @route /message/:id
 * @method Get
 */
export const getMessage = async (req, res) => {
    const id = req.params.id
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such message(wrong id) '
        })
    } else {
        try {
            const result = await message.findById(id);
            res.status(200).json({
                message: "success",
                data: result
            })
        } catch (err) {
            console.log(err)
            logger(err)
            res.status(400).send({
                message: "fail retrieving data"
            })
        }
    }
}
/**
 * createMessage : create message
 * @route /message
 * @method post
 * @body  type,conversation_id,user,mentioned_users,readBy,is_removed,message,data,attachments,parent_message_id,parent_message_info,location,origin
 */
export const postMessage = async (req, res) => {
    const data = {
        type: req.body.type,
        conversation_id: req.body.conversation_id,
        user: req.body.user,
        mentioned_users: req.body.mentioned_users,
        readBy: req.body.readBy,
        message: req.body.message,
        origin: req.body.origin

    }
    const check = Joi.object({
        type: Joi.string().required(),
        conversation_id: Joi.string().required(),
        user: Joi.string().required(),
        mentioned_users: Joi.string().required(),
        readBy: Joi.string().required(),
        message: Joi.string().required().min(1).max(256),
        origin: Joi.string().required()
    })
    const {
        error
    } = check.validate(data)
    if (error) {
        res.status(400).send({
            'error': error.details[0].message
        })
    } else {
        try {
            const result = await message.create(req.body);
            if (result) {
                res.status(201).json({
                    message: "success",
                    date: result
                })
            } else {
                res.status(400).json({
                    "error": 'failed to create new message'
                })
            }
        } catch (err) {
            res.status(400).json({
                'error': 'some error occurred.try again'
            })
            logger(err)
            console.log(err)
        }
    }
}
/**
 * updateMessage : update message data
 * @route /message/:id
 * @method put
 */
export const putMessage= async (req, res) => {
    const id = req.params.id
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such member (wrong id)'
        })
    } else {
        const data = {
            type: req.body.type,
            conversation_id: req.body.conversation_id,
            user: req.body.user,
            mentioned_users: req.body.mentioned_users,
            readBy: req.body.readBy,
            message: req.body.message,
            origin: req.body.origin
        }
        const check = Joi.object({
            type: Joi.string().required(),
            conversation_id: Joi.string().required(),
            user: Joi.string().required(),
            mentioned_users: Joi.string().required(),
            readBy: Joi.string().required(),
            message: Joi.string().required().min(1).max(256),
            origin: Joi.string().required()

        })
        const {
            error
        } = check.validate(data)
        if (error) {
            res.status(400).send({
                'error': error.details[0].message
            })
        } else {
            try {
                const result = await message.findByIdAndUpdate(
                    id, {
                        $set: req.body
                    })
                if (result) {
                    res.status(202).json({
                        message: "success",
                        data: result
                    })
                } else {
                    res.status(400).send({
                        'error': 'wrong values'
                    })
                }

            } catch (err) {
                res.status(400).send({
                    'error': 'some error occurred. Try again (verify your params values ) '
                })
                logger(err)
            }
        }
    }

}
/**
 * deleteMessage : delete message
 * @route /message/:id
 * @method delete
 */
export const deleteMessage = async (req, res) => {
    const id = req.params.id
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such message to delete (wrong id) '
        })
    } else {
        try {
            const result = await message.findByIdAndDelete(id)
            if (result) {
                res.status(202).json({
                    message: "success",
                })
            } else {
                res.status(400).send({
                    'error': 'there is no such message'
                })
            }
        } catch (err) {
            res.status(400).send({
                'error': 'some error occurred. Try again '
            })
        }
    }
}