const Doc = require('../models/doc');

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
                throw new Error("404: Not Found");
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
                throw new Error("404: Not Found");
            }
            await doc.destroy();
            return {message: "deleted"};
        } catch (error) {
            console.log(error);
        }
    }

    static async getById(pk)
    {
        try {
            const doc = await Doc.getById(pk);
            if(!doc)
            {
                throw new Error("404: Not Found");
            }
            return doc.toJSON();
        } catch (error) {
            console.log(error);
        }
    }

    static async getByContentTitle(title)
    {
        try {
            const doc = await Doc.findOne({where: {title}});
            if(!doc)
            {
                return new Error("404: Not Found");
            }
            return doc.toJSON();
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = DocService;