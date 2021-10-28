import Category from "../models/Category.js";

const CategoryController = {
    async index (req, res) {
        const allCategories = await Category.getAll();

        return res.status(200).json({
            statusCode: 200,
            length: allCategories.length,
            data: allCategories
        });
    }
}

export default CategoryController;