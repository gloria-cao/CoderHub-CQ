const errorType = require("../constants/error.type");

const errorHandler = (error, ctx) => {
  let status, message;

  switch (error.message) {
    case errorType.NAME_OR_PASSWORD_IS_REQUIRED:
      status = 400; //Bad Request
      message = "用户名或者密码不能为空~";
      break;
    case errorType.USER_ALREADY_EXISTS:
      status = 409; //conflict
      message = "用户名已存在~";
      break;
    case errorType.USER_DOES_NOT_EXISTS:
      status = 400; //conflict
      message = "用户名不存在~";
      break;
    case errorType.PASSWORD_IS_INCORRENT:
      status = 400; //conflict
      message = "密码不正确~";
      break;
    case errorType.UNAUTHORIZATION:
      status = 401; //过期或者token不正确
      message = "无效的token~";
      break;
    case errorType.UNPERMISSION:
      status = 401; //权限不够
      message = "用户不具备该权限~";
      break;
    default:
      status = 404;
      message = "NOT FOUND";
  }

  ctx.status = status;
  ctx.body = message;
};

module.exports = errorHandler;
