import express from 'express';
import CustomerController from '../controller/CustomerController.js';

const router = express.Router();

router.get('/customer', CustomerController.index);

export default router;