import db from '../../db.js';

const Customer = {
    async getAllCustomer() {
        const allCustomer = await db('customers').select('*');

        return allCustomer;
    },

    async getById(id) {
        const customer = await db('customers')
                            .where({id: id})
                            .select('id', 'email', 'full_name', 'phone_number', 'default_shipping_address', 'country')
                            .first();

        return customer;
    },

    async getByEmail(email) {
        const customer = await db('customers')
                            .where({email: email})
                            .select('id', 'email', 'full_name', 'phone_number', 'default_shipping_address', 'country')
                            .first();

        return customer;
    },

    async getByEmailShowPassword(email) {
        const customer = await db('customers')
                            .where({email: email})
                            .select('id', 'email', 'password', 'full_name', 'phone_number', 'default_shipping_address', 'country')
                            .first();

        return customer;
    },

    async register(data, trx) {
        const customer = await db('customers').insert(data).transacting(trx);

        return customer;
    }

}

export default Customer;
