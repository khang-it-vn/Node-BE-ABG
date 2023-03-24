const Account = require('../models/account');

class AccountService {
  static async createAccount(accountData) {
    try {
      
      const account = await Account.create(accountData);
      return account.toJSON();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async updateAccount(accountId, accountData) {
    try {
      const account = await Account.findByPk(accountId);
      if (!account) {
        throw new Error('Account not found');
      }
      const updatedAccount = await account.update(accountData);
      return updatedAccount.toJSON();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async deleteAccount(accountId) {
    try {
      const account = await Account.findByPk(accountId);
      if (!account) {
        throw new Error('Account not found');
      }
      await account.destroy();
      return { message: 'Account deleted' };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // Kiểm tra xem mail đã tồn tại chưa
  static async checkMailExist(mail) {
    try {
      const account = await Account.findOne({ where: { mail } });
      if (account) {
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  
  
  // Lấy về thông tin của một tài khoản 
  static async getAccountByEmail(mail) {
    try {
      const account = await Account.findOne({ where: { mail } });
      if (!account) {
        return null;
      }
      return account.toJSON();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  
  
}
}

module.exports = AccountService;
