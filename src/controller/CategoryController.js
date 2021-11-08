import Category from "../models/Category.js";
import { check, validationResult } from 'express-validator';
import db from '../../db.js';
import fileSystem from 'fs';
import path from 'path';

const CategoryController = {
    async index (req, res) {
        const allCategories = await Category.getAll();

        return res.status(200).json({
            statusCode: 200,
            length: allCategories.length,
            data: allCategories
        });
    },

    createValidation: [
        check('name')
            .notEmpty()
            .withMessage('Name field is required')
            .isLength({ max: 255})
            .withMessage('Name length must be at most 255 character')
    ],

    async create (req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.mapped()
            });
        }

        try {

            const data = {
                name: req.body.name,
                description: req.body.description
            };
            
            if (req.file) {
                let tmpPath = req.file.path;
                let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
                let fileName = req.file.filename + '.' + originalExt;
                let targetPath = path.resolve(`public/uploads/${fileName}`);

                const src = fileSystem.createReadStream(tmpPath);
                const dest = fileSystem.createWriteStream(targetPath);

                src.pipe(dest);
                src.on('end', async() => {
                    data.thumbnail = fileName;

                    return res.status(201).json({
                        status: 'Success',
                        statusCode: 201,
                        // message: 'Customer account successfully registered.',
                        data: data
                    });
                });
            } else {

                return res.status(201).json({
                    status: 'Success',
                    statusCode: 201,
                    // message: 'Customer account successfully registered.',
                    data: data
                });
            }

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 'Internal Server Error',
                statusCode: 500,
                message: 'Please contact admin!'
            });
        }
    }
}

export default CategoryController;