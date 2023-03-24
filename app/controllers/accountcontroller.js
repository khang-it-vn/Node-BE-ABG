const express = require("express");
const router = express.Router();
const { ethers } = require("ethers");
const AccountService = require("../services/accountService");

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
      const account = {
        fullname: payload["name"],
        mail: payload["email"],
        avatar: payload["picture"],
        address: wallet.address,
        privateKey: wallet.privateKey,
      };
      AccountService.createAccount(account);

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
        ],
        {
          token: jsonwebtoken.sign(
            { user: "admin", roles: authorities, claims: claims },
            config.jwt.secret,
            { expiresIn: jwtExpirySeconds }
          ),
        }
      );
    } catch (error) {
      res.json({
        success: false,
        message: "Login failed with error " + error.message,
      });
    }
  }
  verify(req.body.credential);
});

//

module.exports = router;
