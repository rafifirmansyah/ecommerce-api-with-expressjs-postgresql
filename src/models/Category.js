import db from '../../db.js';

const Category = {
    async getAll() {
        const categories = await db('categories').select('*');

        return categories;
    },

    async create(data, trx) {
        const category = await db('categories').insert(data).transacting(trx);

        return category;
    }
};

export default Category;