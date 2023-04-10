const TransferDetail = require('../models/transferdetail');
const Account = require('../models/account');

// Define the TransferDetailService class
class TransferDetailService {
  // Define a static method to create a new transfer detail
  static async createTransferDetail(txh, id_account_sender, id_account_receiver, amount, tip) {
    try {
      const transferDetail = await TransferDetail.create({
        txh,
        id_account_sender,
        id_account_receiver,
        amount,
        tip,
        time_create: new Date()
      });
      return transferDetail.toJSON();
    } catch (error) {
      console.error(error);
    }
  }

  // Define a static method to retrieve a transfer detail by its txh
  static async getTransferDetailByTxh(txh) {
    try {
      const transferDetail = await TransferDetail.findByPk(txh);
      return transferDetail.toJSON();
    } catch (error) {
      console.error(error);
    }
  }

  // Define a static method to update a transfer detail by its txh
  static async updateTransferDetailByTxh(txh, updatedFields) {
    try {
      const [numRows, [updatedTransferDetail]] = await TransferDetail.update(updatedFields, {
        where: {
          txh
        },
        returning: true
      });
      return updatedTransferDetail;
    } catch (error) {
      console.error(error);
    }
  }

  // Define a static method to delete a transfer detail by its txh
  static async deleteTransferDetailByTxh(txh) {
    try {
      const transferDetail = await TransferDetail.findByPk(txh);
      if(!transferDetail)
      {
        return false;
      }
      await transferDetail.destroy();
      return true;
    } catch (error) {
      console.error(error);
    }
  }


  static async getStranferDetailHistory(id_account_sender)
  {
    try {
      const transferDetails = await TransferDetail.findAll({
        where: {id_account_sender},
        include: [
          { model: Account, as: 'sender', attributes: ['fullname', 'email', 'address'] },
          { model: Account, as: 'receiver', attributes: ['fullname', 'email', 'address'] }
        ]
      });

      if(!transferDetails)
      {
        return null;
      }
      return transferDetails.map(transferDetail =>transferDetail.toJSON());
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getReceiveHistory(id_account_receiver)
  {
    try {
      const transferDetails = await TransferDetail.findAll({
        where: {id_account_receiver},
        include: [
          { model: Account, as: 'sender', attributes: ['fullname', 'email', 'address'] },
          { model: Account, as: 'receiver', attributes: ['fullname', 'email', 'address'] }
        ]
      });

      if(!transferDetails)
      {
        return null;
      }
      return transferDetails.map(transferDetail => transferDetail.toJSON());
    } catch (error) {
      throw new Error(error);
    }
  }
}

// Export the TransferDetailService class
module.exports = TransferDetailService;