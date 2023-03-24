const express = require("express");
const router = express.Router();
const { ethers } = require("ethers");
const AccountService = require("../services/accountService");
const jsonwebtoken = require("jsonwebtoken");
var config = require("../config/jwt-setting.json");
var verifyToken = require("../util/verifyToken");
const jwtExpirySeconds = 1000;
// api login from google
router.post("/login", (req, res) => {
  const { OAuth2Client } = require("google-auth-library");
  const CLIENT_ID = "365062625571-oipgvhgr69fn34i2hahqdk1483hdqllg.apps.googleusercontent.com";
  const client = new OAuth2Client(CLIENT_ID);

  async function verify(token) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const wallet = ethers.Wallet.createRandom();
      
      const state = await AccountService.checkMailExist(payload['email']); // nếu email này tồn tại sẽ trả về true
      if (!state) {
        const account = {
          fullname: payload["name"],
          mail: payload["email"],
          avatar: payload["picture"],
          address: wallet.address,
          privateKey: wallet.privateKey,
        };
        AccountService.createAccount(account);
      }
      var authorities = [];
      authorities.push("admin");
      authorities.push("customer");
      var claims = [];
      claims.push("product.view");
      claims.push("product.edit");
      claims.push("product.delete");

      res.json(
        [
          {
            success: "true",
            message: "Login success",
          },
        ,
        {
          token: jsonwebtoken.sign(
            { user: "admin", roles: authorities, claims: claims },
            config.jwt.secret,
            { expiresIn: jwtExpirySeconds }
          ),
        }]
      );
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Login failed with error " + error.message,
      });
    }
  }
  verify(req.body.credential);
});

//

module.exports = router;
