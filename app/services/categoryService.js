const Category = require('../models/category');

class CategoryService{
    static async create(category)
    {
        try {
            
            const object = await Category.create(category);
            return object.toJSON();
        } catch (error) {
            throw new Error(error);
        }
    }

    static async findAll()
    {
        try {
            const categorys = await Category.findAll();
            return categorys.map(category => category.toJSON());
        } catch (error) {
            throw new Error(error);
        }
    }

    static async findByPk(pk)
    {
        try {
            const category = await Category.findByPk(pk);
            if(!category)
            {
                return null;
            }
            return category.toJSON();
        } catch (error) {
            throw new Error(error);
        }
    }

}

module.exports = CategoryService;