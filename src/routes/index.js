import express from 'express';
import CustomerController from '../controller/CustomerController.js';

const router = express.Router();

router.get('/customers', CustomerController.index);
router.get('/customers/:id', CustomerController.findById);
router.post('/register', CustomerController.registerValidation, CustomerController.register);
router.post('/login', CustomerController.loginValidation, CustomerController.login);

export default router;