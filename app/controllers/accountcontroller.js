require("dotenv").config();
const express = require("express");
const router = express.Router();
const AccountService = require("../services/accountService");
const jsonwebtoken = require("jsonwebtoken");
var config = require("../config/jwt-setting.json");
var verifyToken = require("../util/verifyToken");
var checkmpass = require("../util/checkmpass");
const jwtExpirySeconds = 1000000000;
const AdminService = require("../services/adminService");
const TransferDetailService = require("../services/transferDetailService");

// web3
const EthereumTx = require("ethereumjs-tx");
const Tx = require("ethereumjs-tx").Transaction;
const { Buffer } = require("buffer");
let { usdtContract, web3 } = require("../config/usdtContract");
const EthereumUtil = require("ethereumjs-util");

// api login from google
router.post("/login", (req, res) => {
  const { OAuth2Client } = require("google-auth-library");
  const CLIENT_ID =
    "365062625571-oipgvhgr69fn34i2hahqdk1483hdqllg.apps.googleusercontent.com";
  const client = new OAuth2Client(CLIENT_ID);
  async function verify(token) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
      });
      // get thông tin từ api cloud google
      const payload = ticket.getPayload();
      let account;
      let isAdmin = false;

      // kiểm tra xem admin đã tồn taij chưa
      let admin = await AdminService.getByEmail(payload["email"]);
      if (admin == null) {
        const state = await AccountService.checkMailExist(payload["email"]); // nếu email này tồn tại sẽ trả về true
        // nếu email không tồn tại tiến hành tạo tài khoản và tạo ví
        if (!state) {
          // const wallet = ethers.Wallet.createRandom(); -> create wallet with ether

          // create wallet with web3
          const wallet = web3.eth.accounts.create();
          let privateKey = "";
          if (
            typeof wallet.privateKey === "string" &&
            wallet.privateKey.startsWith("0x")
          ) {
            privateKey = wallet.privateKey.substring(2); // remove '0x' prefix
          }
          const tx = {
            nonce: web3.utils.toHex(
              await web3.eth.getTransactionCount(wallet.address)
            ),
            gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
            gasLimit: web3.utils.toHex(21000),
            to: "0x0000000000000000000000000000000000000000",
            value: web3.utils.toHex(web3.utils.toWei("1", "ether")),
            data: "0x",
          };
          const signedTx = await web3.eth.accounts.signTransaction(
            tx,
            privateKey
          );
          const privateKeyBuffer = Buffer.from(privateKey, "hex");
          const publicKey = EthereumUtil.bufferToHex(
            EthereumUtil.privateToPublic(privateKeyBuffer)
          );

          console.log("wallet created with info: ");

          console.log(wallet);
          account = {
            fullname: payload["name"],
            email: payload["email"],
            avatar: payload["picture"],
            address: wallet.address,
            publicKey: publicKey,
            privateKey: wallet.privateKey,
          };
          AccountService.createAccount(account);
        } else {
          // nếu email này không tồn tại trong bảng admin thì thực hiện tìm kiếm user
          account = await AccountService.getAccountByEmail(payload["email"]);
        }
      } // nếu email này đang tồn tại trong bảng admin thì thực hiện account lúc này là admin
      else {
        isAdmin = true;
        account = admin;
      }

      var authorities = [];
      authorities.push("admin");
      authorities.push("customer");
      var claims = [];
      claims.push("product.view");
      claims.push("product.edit");
      claims.push("product.delete");

      var roles = {
        from: 0,
        title: "User",
      };
      if (isAdmin) {
        let from = 2; // default là admin store value là 2
        if (account.type == process.env.ADMIN_DOC) from = 1;
        roles = {
          from: from,
          title: from === 1 ? "Admin Docs" : "Admin Store",
        };
      }
      res.status(200).json([
        {
          success: "true",
          message: "Login success",
        },
        {
          token: jsonwebtoken.sign(
            {
              user: { email: payload["email"], address: account.address },
              roles: authorities,
              claims: claims,
            },
            config.jwt.secret,
            { expiresIn: jwtExpirySeconds }
          ),
        },
        {
          roles: roles,
        },
      ]);
    } catch (error) {
      console.log(error);
      res.status(401).json({
        success: false,
        message: "Login failed with error " + error,
      });
    }
  }
  verify(req.body.credential);
});

//  Lấy thông tin cá nhân
router.get("/getUserInfo", verifyToken, checkmpass, async (req, res) => {
  let account = await AccountService.getAccountByEmail(req.userData.user.email);

  res.status(200).json([
    {
      id_account: account.id_account,
      fullname: account.fullname,
      avatar: account.avatar,
      address: account.address,
      publicKey: account.publicKey,
      email: account.email,
    },
    {
      message: "info account",
      success: true,
    },
  ]);
});

// Cập nhật thông tin mpass
router.put("/update-m-pass", verifyToken, async (req, res) => {
  let account = await AccountService.getAccountByEmail(req.userData.user.email);
  const mpass = req.body.mpass;
  if (mpass.length != 5) {
    const result = await AccountService.updateMpass(account.id_account, mpass);
    if (result) {
      res.status(200).json({
        message: "Update mpass success",
        success: true,
      });
      return;
    }
  }
  res.status(304).json({
    message: "Update mpass false, length of mpass is only 6 character",
    success: false,
  });
});

// Kiểm tra số dư tài khoản
// API to get wallet balance
// Nếu địa chỉ ví bị sai thì số dư vẫn trả về 0
router.get("/getBalance", verifyToken, async (req, res) => {
  const balance = await usdtContract.methods
    .balanceOf(req.userData.user.address)
    .call();
  res.json({
    success: true,
    message: "get balance of address",
    balance: web3.utils.fromWei(balance, "mwei"),
  });
});
router.post("/transferUSDT", verifyToken, async (req, res) => {
  try {
    let { toAddress, amount, mpass } = req.body;
    let fromAddress = req.userData.user.address;

    // get info account 
    let toAccount = await AccountService.getAccountByAddress(toAddress);
    let fromAccount = await AccountService.getAccountByAddress(fromAddress);
    if(mpass !== fromAccount.mpass)
    {
      return res.status(403).json({message: "Failed Mpass"});
    }
    let decimals = await usdtContract.methods.decimals().call();
    let amountToSend = web3.utils.toWei(amount.toString(), "ether");
    let txCount = await web3.eth.getTransactionCount(fromAddress);

    let gasPrice = await web3.eth.getGasPrice();
    console.log(gasPrice);
    let gasLimit = await web3.eth.estimateGas({
      to: toAddress,
      data: usdtContract.methods.transfer(toAddress, amountToSend).encodeABI(),
      from: fromAddress,
    });
    console.log(gasLimit);
    let txObject = {
      nonce: web3.utils.toHex(txCount),
      to: process.env.USDT_CONTRACT_ADDRESS,
      gasLimit: web3.utils.toHex(21000), // 100000
      gasPrice: web3.utils.toHex(gasPrice), // dsyfuidsf
      data: usdtContract.methods.transfer(toAddress, amountToSend).encodeABI(),
    };
    
    let tx = new Tx(txObject, { chain: "mainnet", hardfork: "petersburg" });

    tx.sign(Buffer.from(fromAccount.privateKey.substring(2), "hex"));
    let serializedTx = tx.serialize();
    let raw = "0x" + serializedTx.toString("hex");
    let receipt = await web3.eth.sendSignedTransaction(raw);

    let transferDetail = await TransferDetailService.createTransferDetail(
      receipt.transactionHash,
      fromAccount.id_account,
      toAccount.id_account,
      amount,
      gasPrice * gasLimit
    );
    res.json({
      success: true,
      message: "Chuyển USDT thành công",
      txHash: receipt.transactionHash,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Chuyển USDT thất bại với lỗi: " + error.message,
    });
  }
});

router.get("/txStatus/:txHash", async (req, res) => {
  try {
    // Lấy mã giao dịch từ request
    const txHash = req.params.txHash;
    // Lấy thông tin chi tiết của giao dịch từ blockchain
    const tx = await web3.eth.getTransaction(txHash);
    // Lấy trạng thái của giao dịch từ blockchain
    const txReceipt = await web3.eth.getTransactionReceipt(txHash);
    // Lấy thông tin ví nguồn và đích từ cơ sở dữ liệu
    const transferDetail = await TransferDetailService.getTransferDetailByTxh(
      txHash
    );
    // Kiểm tra trạng thái của giao dịch
    if (txReceipt && txReceipt.status) {
      // Giao dịch đã thành công
      const fromAddress = tx.from;
      const toAddress = tx.to;
      const amount = web3.utils.fromWei(
        transferDetail.amount.toString(),
        "ether"
      );
      res.json({
        success: true,
        message: "Transaction succeeded",
        from: fromAddress,
        to: toAddress,
        amount: amount,
      });
    } else {
      // Giao dịch thất bại hoặc đang chờ xử lý
      res.json({
        success: false,
        message: "Transaction failed or pending",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Failed to get transaction status with error " + error.message,
    });
  }
});

router.get("/latest-block-transactions", async (req, res) => {
  try {
    const latestBlock = await web3.eth.getBlock("latest");
    const txs = latestBlock.transactions;
    const txDetails = await Promise.all(
      txs.map((tx) => web3.eth.getTransaction(tx))
    );
    res.json(txDetails);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/checkStatueTransaction/:address", async (req, res) => {
  try {
    const address = req.params.address;
    console.log(address);
    const latestBlock = await web3.eth.getBlock("latest");
    const txs = latestBlock.transactions;
    const txDetails = await Promise.all(
      txs.map((tx) => web3.eth.getTransaction(tx))
    );

    txDetails.forEach((element) => {
      console.log(element.to === address);

      if (element.to === address) {
        return res
          .status(200)
          .json({
            to: element.to,
            from: element.from,
            amount: web3.utils.fromWei(element.value, "ether"),
          });
      }
    });

    res.status(404).json({message: "Not found"});
  } catch (error) {
    res.status(404).json({ message: "No transaction found for this address" });
  }
});


// API to get transfer detail using id_account_sender
router.get("/getHistoryTransfer", verifyToken, async (req, res) => {
  try {
    let account = await AccountService.getAccountByEmail(req.userData.user.email);
    const transferDetails = await TransferDetailService.getStranferDetailHistory(
      account.id_account
    );
    res.json({
      success: true,
      message: "Get transfer detail successfully",
      transferDetails: transferDetails,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Failed to get transfer detail with error " + error.message,
    });
  }
}); 


// API to get transfer detail using id_account_sender
router.get("/getHistoryReceive", verifyToken, async (req, res) => {
  try {
    let account = await AccountService.getAccountByEmail(req.userData.user.email);
    const transferDetails = await TransferDetailService.getReceiveHistory(
      account.id_account
    );
    res.json({
      success: true,
      message: "Get receive stranfer detail successfully",
      transferDetails: transferDetails,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Failed to get receive transfer detail with error " + error.message,
    });
  }
}); 

router.get('/checkAccountFromAddress/:address', verifyToken, async (req, res ) => {
    try {
      const addressCurrent = req.userData.user.address;
      const address = req.params.address;
      console.log(address);
      console.log(addressCurrent);
      if(addressCurrent === address)
      {
        return res.status(404).json({message: "Undefined account"});
      }
      const wallet = await AccountService.getAccountByAddress(address);
      if(!wallet)
      {
        return res.status(404).json({message: "Undefined account in solo wallet"});
      }

      return res.status(200).json({
        fullname: wallet.fullname,
        address: wallet.address,
        id_account: wallet.id_account,
        avatar: wallet.avatar
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({message: 'server has error with content: ' + error.message});
    }
});

router.get("/getBalanceFromAddress/:address", verifyToken, async (req, res) => {
  const balance = await usdtContract.methods
    .balanceOf(req.params.address)
    .call();
  res.json({
    success: true,
    message: "get balance of address",
    balance: web3.utils.fromWei(balance, "mwei"),
  });
});

router.get('/getFees', verifyToken, async (req, res) => {

  // Sử dụng web3 để lấy thông tin chi phí ước tính
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 100000;
    const estimatedFee = web3.utils.fromWei((gasPrice * gasLimit).toString(), 'ether');
    res.json({
      success: true,
      message: "Estimated fee",
      fee: estimatedFee,
    });
})


// API to check if user's wallet address exists in the latest 10 blocks
router.get("/checkWalletAddressInLatestBlocks/:address", async (req, res) => {
  try {
    console.log(req.params.address);
    const address = req.params.address;
    const latestBlockNumber = await web3.eth.getBlockNumber();
    const blockNumbers = Array.from(
      { length: 10 },
      (_, i) => latestBlockNumber - i
    );
    const blocks = await Promise.all(
      blockNumbers.map((blockNumber) =>
        web3.eth.getBlock(blockNumber, true)
      )
    );
    const txs = blocks.flatMap((block) =>
      block.transactions.map((tx) => ({
        to: tx.to,
        from: tx.from,
        value: tx.value,
      }))
    );
    const txDetails = txs.filter((tx) => tx.to === address || tx.from === address);

    if (txDetails.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Wallet address exists in the latest 10 blocks",
        transactions: txDetails,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Wallet address does not exist in the latest 10 blocks",
      });
    }


  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/xinchao', (req, res) => {
  res.send('xin chào')
})
module.exports = router;
