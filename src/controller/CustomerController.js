import Customer from '../models/Customer.js';
import { check, validationResult } from 'express-validator';
import db from '../../db.js';
import bcrypt from 'bcryptjs';
import env from 'dotenv';
import jwt from 'jsonwebtoken';

env.config();

const CustomerController = {
    async index (req, res) {
        const allCustomer = await Customer.getAllCustomer();

        return res.status(200).json({
            statusCode: 200,
            length: allCustomer.length,
            data: allCustomer
        });
    },

    async findById (req, res) {
        const id = req.params.id;
        const customer = await Customer.getCustomerById(id);

        if (!customer) {
            return res.status(404).json({
                status: 'Not Found',
                statusCode: 404,
                message: 'You are not registered'
            });
        }

        return res.status(200).json({
            status: 'Success',
            statusCode: 200,
            data: customer
        });
    },
    
    registerValidation: [
        check('email')
            .notEmpty()
            .withMessage('E-mail field is required')
            .isEmail()
            .withMessage('Enter valid e-mail. example user@example.com')
            .isLength({ max: 255})
            .withMessage('E-mail length must be at most 255 character')
            .custom(async value => {
                const customer = await Customer.getCustomerByEmail(value);

                if (customer) {
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
        check('full_name')
            .notEmpty()
            .withMessage('Name field is required')
            .isLength({ max: 255})
            .withMessage('Name length must be at most 255 character'),
        check('default_shipping_address')
            .notEmpty()
            .withMessage('Address field is required'),
        check('country')
            .notEmpty()
            .withMessage('Country field is required'),
        check('phone_number')
            .notEmpty()
            .withMessage('Phone Number field is required')
            .isNumeric()
            .withMessage('Phone Number field must be numeric character')
            .isLength({ min: 9})
            .withMessage('Phone Number length must be at least 9 character')
            .isLength({ max: 13})
            .withMessage('Phone Number length must be at most 13 character')  
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

                // Register
                await Customer.registerCustomer(req.body, trx);
                
                return res.status(201).json({
                    status: 'Success',
                    statusCode: 201,
                    message: 'Customer account successfully registered.'
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

        const customer = await Customer.getCustomerByEmailShowPassword(req.body.email);

        if (customer) {
            const checkPassword = bcrypt.compareSync(req.body.password, customer.password);

            if (checkPassword) {
                const token = jwt.sign({
                    customer: {
                        id: customer.id,
                        email: customer.email,
                        full_name: customer.full_name
                    }
                }, process.env.JWT_KEY);

                return res.status(200).json({
                    status: 'Success',
                    statusCode: 200,
                    data: token
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
};

export default CustomerController;