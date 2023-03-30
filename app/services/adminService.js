const Admin = require("../models/admin");

class AdminService {
  static async create(model) {
    try {
      const object = await Admin.create(model);
      return object.toJSON();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async update(pk, newDataModel) {
    try {
      const newObject = await Admin.findByPk(pk);
      if (!newObject) {
        throw new Error("404: Not Found");
      }
      const updateObject = await newObject.update(newDataModel);
      return updateObject.toJSON();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async delete(pk) {
    try {
      const object = await Admin.findByPk(pk);
      if (!object) {
        throw new Error("404: Not Found");
      }
      await object.destroy();
      return { message: "Deleted" };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Kiểm tra xem mail đã tồn tại chưa
  static async checkMailExist(email) {
    try {
      const object = await Admin.findOne({ where: { email } });
      if (object) {
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Lấy về thông tin của một tài khoản
  static async getByEmail(email) {
    try {
      const object = await Admin.findOne({ where: { email } });
      if (!object) {
        return null;
      }
      return object.toJSON();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  
}

module.exports = AdminService;
