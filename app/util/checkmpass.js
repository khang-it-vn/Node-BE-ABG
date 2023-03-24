const AccountService = require('../services/accountService');


async function checkmpass(req,res,next) {
    const account = await AccountService.getAccountByEmail(req.userData.user.mail);
    if(account.mpass === null)
    {
        return res.status(403).json({success: false, message: "Bạn cần cập nhật mpass - mpass missing"})
    }
    await next();
}
module.exports = checkmpass;