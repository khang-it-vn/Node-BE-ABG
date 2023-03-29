const express = require("express");
const router = express.Router();
const { ethers } = require("ethers");
const AccountService = require("../services/accountService");
const jsonwebtoken = require("jsonwebtoken");
var config = require("../config/jwt-setting.json");
var verifyToken = require("../util/verifyToken");
var checkmpass = require("../util/checkmpass");
let { usdtContract, web3 } = require("../config/usdtContract");
const jwtExpirySeconds = 1000;

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
      const payload = ticket.getPayload();
      const wallet = ethers.Wallet.createRandom();

      const state = await AccountService.checkMailExist(payload["email"]); // nếu email này tồn tại sẽ trả về true
      let account;
      if (!state) {
        account = {
          fullname: payload["name"],
          email: payload["email"],
          avatar: payload["picture"],
          address: wallet.address,
          privateKey: wallet.privateKey,
        };
        AccountService.createAccount(account);
      } else {
        account = await AccountService.getAccountByEmail(payload["email"]);
      }
      var authorities = [];
      authorities.push("admin");
      authorities.push("customer");
      var claims = [];
      claims.push("product.view");
      claims.push("product.edit");
      claims.push("product.delete");

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
      ]);
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Login failed with error " + error.message,
      });
    }
  }
  verify(req.body.credential);
});

//  Lấy thông tin cá nhân
router.get("/getUserInfo", verifyToken, checkmpass, async (req, res) => {
  let account = await AccountService.getAccountByEmail(req.userData.user.email);

  res.status(200).json([
    account,
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

module.exports = router;
