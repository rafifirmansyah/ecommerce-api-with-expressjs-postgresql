import db from '../../db.js';

const Customer = {
    async getAllCustomer() {
        const allCustomer = await db('customers').select('*');

        return allCustomer;
    },

    async getCustomerById(id) {
        const customer = await db('customers')
                            .where({id: id})
                            .select('id', 'email', 'full_name', 'phone_number', 'default_shipping_address', 'country')
                            .first();

        return customer;
    },

    async getCustomerByEmail(email) {
        const customer = await db('customers')
                            .where({email: email})
                            .select('id', 'email', 'full_name', 'phone_number', 'default_shipping_address', 'country')
                            .first();

        return customer;
    },

    async getCustomerByEmailShowPassword(email) {
        const customer = await db('customers')
                            .where({email: email})
                            .select('id', 'email', 'password', 'full_name', 'phone_number', 'default_shipping_address', 'country')
                            .first();

        return customer;
    },

    async registerCustomer(data, trx) {
        const customer = await db('customers').insert(data).transacting(trx);

        return customer;
    }

}

export default Customer;
