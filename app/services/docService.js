const Doc = require('../models/doc');
const {Op} = require("sequelize");

class DocService{

    static async create(doc) {
        try {
            const object = await Doc.create(doc);
            return object.toJSON();
        } catch (error) {
            console.log(error);
            
        }
    }

    static async update(primaryKey, newDoc){
        try {
            const oldDoc = await Doc.findByPk(primaryKey);
            if(!oldDoc)
            {
                return null;
            }
            const updateDoc = await oldDoc.update(newDoc);
            return updateDoc.toJSON();
        } catch (error) {
            console.log(error);
        }
    }

    static async delete(pk)
    {
        try {
            const doc = await Doc.findByPk(pk);
            if(!doc)
            {
                return false;
            }
            await doc.destroy();
            return true;
        } catch (error) {
            console.log(error);
        }
    }

    static async getById(pk)
    {
        try {
            console.log(Doc);
            const doc = await Doc.findByPk(pk); // nếu doc không có giá trị thì giá trị của doc là undefined
            if(!doc)
            {
               return null;
            }
            return doc.toJSON();
        } catch (error) {
            console.log(error);
        }
    }

    static async getByContentTitle(title)
    {
        try {
            const docs = await Doc.findAll({where: {title: {[Op.like]: `%${title}%`}}});
            if(!docs)
            {
               return null;
            }
            return docs.map(doc => doc.toJSON());
        } catch (error) {
            console.log(error);
        }
    }

    static async getAll()
    {
        try {
            const docs = await Doc.findAll();
            return docs.map(doc => doc.toJSON());
        } catch (error) {
            console.log(error);
        }
    }
}
 
module.exports = DocService;