const AccountService = require('../services/accountService');


async function checkmpass(req,res,next) {
   const user = req.userData;
   console.log(user);
    const account = await AccountService.getAccountByEmail(user.user);
    if(account.mpass === null)
    {
        return res.status(403).json({success: false, message: "Bạn cần cập nhật mpass - mpass missing"})
    }
    await next();
}
module.exports = checkmpass;