import user from '../models/userModel.js'
import debug from "debug"
import Joi from "joi"
import validator from 'validator'
const logger = debug('namespace')


/**
 *  GetUsers :get users data
 * @route /users
 * @method Get 
 */
export const getUsers = async (req, res) => {
    try {
        const result = await user.find();
        if (result.length > 0) {
            res.status(200).json({
                message: "success",
                data: result
            })
        } else {
            res.status(200).json({
                message: "success",
                data: "there are no such user "
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
 * getUser : get user data
 * @route /user/:id
 * @method Get
 */
export const getUser = async (req, res) => {
    const id = req.params.id
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such user(wrong id) '
        })
    } else {
        try {
            const result = await user.findById(id);
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
 * createUser: create user
 * @route /user
 * @method post
 * @body  nickname,full_name,profile_url,access_token,role,is_active,is_online,locale,last_seen_at,metadata
 */
export const postUser = async (req, res) => {
    const data = {
        nickname: req.body.nickname ,
        full_name:req.body. full_name,
        profile_url:req.body. profile_url,
        access_token: req.body.access_token,
        role: req.body.role,
        is_active: req.body.is_active,
        is_online: req.body.is_online,
        locale: req.body.locale,
        last_seen_at: req.body.last_seen_at,
        metadata:req.body.metadata,
    }
    const check = Joi.object({
         nickname:Joi.string().required().min(4).max(48)  ,
        full_name:Joi.string().required().min(4).max(68) ,
        profile_url: Joi.string(),
        access_token:Joi.string().required() ,
        role: Joi.string().required(),
        is_active: Joi.boolean().required(),
        is_online: Joi.boolean().required(),
        locale:Joi.string().required().min(2).max(3),
        last_seen_at:Joi.number().required().default(0) ,
        metadata:Joi.object(),
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
            const result = await user.create(req.body);
            if (result) {
                res.status(201).json({
                    message: "success",
                    date: result
                })
            } else {
                res.status(400).json({
                    "error": 'failed to create new user'
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
 * updateUser : update user data
 * @route /user/:id
 * @method put
 */
export const putUser = async (req, res) => {
    const id = req.params.id
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such user (wrong id)'
        })
    } else {
        const data = {
            nickname: req.body.nickname ,
        full_name:req.body. full_name,
        profile_url:req.body. profile_url,
        access_token: req.body.access_token,
        role: req.body.role,
        is_active: req.body.is_active,
        is_online: req.body.is_online,
        locale: req.body.locale,
        last_seen_at: req.body.last_seen_at,
        metadata:req.body.metadata,

        }
        const check = Joi.object({
            nickname:Joi.string().required().min(4).max(48)  ,
            full_name:Joi.string().required().min(4).max(68) ,
            profile_url: Joi.string(),
            access_token:Joi.string().required() ,
            role: Joi.string().required(),
            is_active: Joi.boolean().required(),
            is_online: Joi.boolean().required(),
            locale:Joi.string().required().min(2).max(3),
            last_seen_at:Joi.number().required().default(0) ,
            metadata:Joi.object(),
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
                const result = await user.findByIdAndUpdate(
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
 * deleteUser : delete user
 * @route /user/:id
 * @method delete
 */
export const deleteUser = async (req, res) => {
    const id = req.params.id
    if (!validator.isMongoId(id)) {
        res.status(400).send({
            'error': 'there is no such user(wrong id) '
        })
    } else {
        try {
            const result = await user.findByIdAndDelete(id)
            if (result) {
                res.status(202).json({
                    message: "success",
                })
            } else {
                res.status(400).send({
                    'error': 'there is no such user'
                })
            }
        } catch (err) {
            res.status(400).send({
                'error': 'some error occurred. Try again '
            })
        }
    }
}