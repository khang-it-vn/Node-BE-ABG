const Product = require('../models/product');
const {Op} = require('sequelize');
class ProductService{

    static async create(product)
    {
        try {
            console.log(Product);
            const object = await Product.create(product);
            return object.toJSON();
        } catch (error) {
            console.log(error);
        }
    }

    static async update(pk, newInfoProduct)
    {
        try {
            
            const oldProduct = await Product.findByPk(pk);
            if(!oldProduct)
            {
                return null;
            }
            const newProduct = await oldProduct.update(newInfoProduct);
            return newProduct.toJSON();
        } catch (error) {
            console.log(error);
        }
    }

    static async delete(pk)
    {
        try {
            
            const product = await Product.findByPk(pk);
            if(!product)
            {
                return false;
            }
            await product.destroy();
            return true;
        } catch (error) {
            console.log(error);
        }
    }

    static async findAll()
    {
        try {
                
            const products = await Product.findAll();
            return products.map(product => product.toJSON());
        } catch (error) {
            
            console.log(error);
        }
    }

    static async findByPk(pk)
    {
        const product = await Product.findByPk(pk);
        if(!product)
        {
            return null;
        }
        return product.toJSON();
    }

    static async findByCategory(id)
    {
        try {
        
            const products = await Doc.findAll({where: id});
            if(!products)
            {
                return null;
            }
            return products.map(product => product.toJSON());
        } catch (error) {
            console.log(error);
        }
    }

    static async findByNameProduct(name)
    {
        try {
            const products = await Product.findAll({where: {name: {[Op.like]: `%${name}%`}}});
            if(!products)
            {
               return null;
            }
            return products.map(product => product.toJSON());
        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = ProductService;
// The error "Product.findByPk is not a function" suggests that the method findByPk is not defined in the Product class. 
// This could be due to a typo in the method name or a missing import statement for the required module that defines the method. 
// In this case, the required module is '../models/product', which should contain the definition for the Product class. 
// We should check that the module is correctly imported and that the class and its methods are defined within the module.