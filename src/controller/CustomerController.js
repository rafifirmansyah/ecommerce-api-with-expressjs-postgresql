import Customer from '../models/Customer.js';

const CustomerController = {
    async index (req, res) {
        const allCustomer = await Customer.getAllCustomer();

        return res.status(200).json({
            statusCode: 200,
            length: allCustomer.length,
            data: allCustomer
        });
    }
};

export default CustomerController;