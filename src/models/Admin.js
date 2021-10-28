import db from '../../db.js';

const Admin = {
    async getById(id) {
        const admin = await db('admins')
                            .where({id: id})
                            .select('id', 'email', 'name')
                            .first();

        return admin;
    },

    async getByEmail(email) {
        const admin = await db('admins')
                            .where({email: email})
                            .select('id', 'email', 'name')
                            .first();

        return admin;
    },

    async getByEmailShowPassword(email) {
        const admin = await db('admins')
                            .where({email: email})
                            .select('id', 'email', 'name', 'password')
                            .first();

        return admin;
    },

    async register(data, trx) {
        const admin = await db('admins').insert(data).transacting(trx);

        return admin;
    }
}

export default Admin;