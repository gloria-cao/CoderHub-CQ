const Router = require("koa-router");
const userRouter = new Router({ prefix: "/users" });

const { create, avatarInfo } = require("../controller/user.controller");

const {
  verifyUser,
  handlePassword,
} = require("../middleware/user.middlieware");

userRouter.post("/", verifyUser, handlePassword, create);
userRouter.get("/:userId/avatar", avatarInfo);

module.exports = userRouter;
