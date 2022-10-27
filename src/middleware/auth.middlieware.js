const jwt = require("jsonwebtoken");

const userService = require("../service/user.service");
const authService = require("../service/auth.service");
const errorTypes = require("../constants/error.type");
const md5password = require("../utils/password-handle");
const { PUBLIC_KEY } = require("../app/config");
// const { emit } = require("../app/database");

const verifyLogin = async (ctx, next) => {
  // 1.获取用户名和密码
  const { name, password } = ctx.request.body;

  // 2.判断用户名和密码是否为空
  if (!name || !password || name === "" || password === "") {
    const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED);
    return ctx.app.emit("error", error, ctx);
  }

  // 3.判断用户是否存在（用户不存在）
  const result = await userService.getUserByName(name);
  const user = result[0];
  if (!user) {
    const error = new Error(errorTypes.USER_DOES_NOT_EXISTS);
    return ctx.app.emit("error", error, ctx);
  }

  // 4.判断密码喝数据库中的密码是否一致（加密）
  if (md5password(password) != user.password) {
    const error = new Error(errorTypes.PASSWORD_IS_INCORRENT);
    return ctx.app.emit("error", error, ctx);
  }

  ctx.user = user;
  await next();
};

const verifyAuth = async (ctx, next) => {
  console.log("验证授权的middlewire~");
  // 1.获取token
  // console.log(ctx.headers);
  const authorization = ctx.headers.authorization;
  if (!authorization) {
    const error = new Error(errorTypes.UNAUTHORIZATION);
    return ctx.app.emit("error", error, ctx);
  }
  const token = authorization.replace("Bearer ", "");

  // 验证token
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ["RS256"],
    });
    ctx.user = result;
    await next();
  } catch (err) {
    // 为什么会抛出异常？？？执行了上面
    const error = new Error(errorTypes.UNAUTHORIZATION);
    ctx.app.emit("error", error, ctx);
  }
};

// 验证权限
const verifyPermission = async (ctx, next) => {
  console.log("验证权限的middleware");

  // 1.获取参数 {commentId: 1} 拿到comment来当作tableName
  const [resourceKey] = Object.keys(ctx.params);
  const tableName = resourceKey.replace("Id", "");
  const resourceId = ctx.params[resourceKey];
  // const { momentId } = ctx.params;
  const { id } = ctx.user;

  // 2.查询是否具备权限
  const isPermission = await authService.checkResource(
    tableName,
    resourceId,
    id
  );
  if (!isPermission) {
    const error = new Error(errorTypes.UNPERMISSION);
    return ctx.app.emit("error", error, ctx);
  }
  await next();
};

module.exports = {
  verifyLogin,
  verifyAuth,
  verifyPermission,
};
