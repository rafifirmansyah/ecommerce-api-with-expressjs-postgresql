import Admin from '../models/Admin.js';
import { check, validationResult } from 'express-validator';
import db from '../../db.js';
import bcrypt from 'bcryptjs';
import env from 'dotenv';
import jwt from 'jsonwebtoken';

env.config();

const AdminController = {
    registerValidation: [
        check('email')
            .notEmpty()
            .withMessage('E-mail field is required')
            .isEmail()
            .withMessage('Enter valid e-mail. example user@example.com')
            .isLength({ max: 255})
            .withMessage('E-mail length must be at most 255 character')
            .custom(async value => {
                const admin = await Admin.getByEmail(value);

                if (admin) {
                    return Promise.reject('E-mail already in use');
                }
            }), 
        check('password')
            .notEmpty()
            .withMessage('Password field is required')
            .isLength({ min: 8})
            .withMessage('Password length must be at least 8 character')
            .isLength({ max: 255})
            .withMessage('Password length must be at most 255 character'),
        check('name')
            .notEmpty()
            .withMessage('Name field is required')
            .isLength({ max: 255})
            .withMessage('Name length must be at most 255 character')
    ],

    async register (req, res) {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.mapped() });
        }

        try {
            // Database Transaction
            await db.transaction(async trx => {
                // Hashing password
                const HASH_ROUND = 10;
                req.body.password = bcrypt.hashSync(req.body.password, HASH_ROUND);

                const data = {
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                };

                // Register
                await Admin.register(data, trx);
                
                return res.status(201).json({
                    status: 'Success',
                    statusCode: 201,
                    message: 'Admin account successfully registered.'
                });
            });
        } catch (error) {
            return res.status(500).json({
                status: 'Internal Server Error',
                statusCode: 500,
                message: 'Please contact admin!'
            });
        }
    },

    loginValidation: [
        check('email')
            .notEmpty()
            .withMessage('E-mail field is required')
            .isEmail()
            .withMessage('Enter valid e-mail. example user@example.com'),
        check('password')
            .notEmpty()
            .withMessage('Password field is required')
    ],

    async login (req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.mapped() });
        }

        const admin = await Admin.getByEmailShowPassword(req.body.email);

        if (admin) {
            const checkPassword = bcrypt.compareSync(req.body.password, admin.password);

            if (checkPassword) {
                const token = jwt.sign({
                    admin: {
                        id: admin.id,
                        email: admin.email,
                        name: admin.name
                    }
                }, process.env.JWT_KEY);

                return res.status(200).json({
                    status: 'Success',
                    statusCode: 200,
                    data: {
                        name: admin.full_name,
                        email: admin.email,
                        phone_number: admin.phone_number,
                        country: admin.country,
                        token: token
                    }
                });
            } else {
                return res.status(422).json({
                    status: 'Not Found',
                    statusCode: 422,
                    message: 'Your password is wrong'
                });
            }
        } else {
            return res.status(404).json({
                status: 'Not Found',
                statusCode: 404,
                message: 'You are not registered'
            });
        }
    }
}

export default AdminController;