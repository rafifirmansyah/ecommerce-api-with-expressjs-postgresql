import multer from 'multer';
import os from 'os';

import express from 'express';
import CustomerController from '../controller/CustomerController.js';
import AdminController from '../controller/AdminController.js';
import CategoryController from '../controller/CategoryController.js';


const router = express.Router();

// Customers
router.get('/customers', CustomerController.index);
router.get('/customers/:id', CustomerController.getById);
router.post('/register', CustomerController.registerValidation, CustomerController.register);
router.post('/login', CustomerController.loginValidation, CustomerController.login);

// Admins
router.post('/admins/register', AdminController.registerValidation, AdminController.register);
router.post('/admins/login', AdminController.loginValidation, AdminController.login);

// Category
router.get('/categories', CategoryController.index);
router.post('/categories', multer({dest: os.tmpdir()}).single('image'), CategoryController.createValidation, CategoryController.create);

export default router;