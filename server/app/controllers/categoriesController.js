import Category  from "../models/categories.js";

class categoriesController {

    // [POST] /categories/create
    async create(req, res, next) {
        try {
            console.log('BODY:', req.body);
            const formData = req.body;
            const newCategories = new Category(formData);
            await newCategories.save();
            res.status(201).json(newCategories);

        } catch (error) {
            next(error);
        }
    }

    // [GET] /categories
    async getAll(req, res, next) {
        try {
            const data = await Category.find(); // lấy toàn bộ document
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }
}

export default new categoriesController()