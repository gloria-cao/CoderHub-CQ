const Router = require("koa-router");

const authRouter = new Router();

const { login, success } = require("../controller/auth.controller");

// 登陆验证中间件
const { verifyLogin, verifyAuth } = require("../middleware/auth.middlieware");

authRouter.post("/login", verifyLogin, login);
// 验证授权
authRouter.get("/test", verifyAuth, success);

module.exports = authRouter;
