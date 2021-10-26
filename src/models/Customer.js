import db from '../../db.js';

const Customer = {
    async getAllCustomer() {
        const allCustomer = await db('customers').select('*');

        return allCustomer;
    }
}

export default Customer;
