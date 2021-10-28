import db from '../../db.js';

const Category = {
    async getAll (req, res) {
        const categories = await db('categories').select('*');

        return categories;
    }
};

export default Category;