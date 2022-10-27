const { verify } = require("jsonwebtoken");
const Router = require("koa-router");

const momentRouter = new Router({ prefix: "/moment" });

const {
  create,
  detail,
  list,
  update,
  remove,
  addLabels,
  fileInfo,
} = require("../controller/moment.controller.js");

const {
  verifyAuth,
  verifyPermission,
} = require("../middleware/auth.middlieware");

const { verifyLabelExists } = require("../middleware/label.middlieware.js");

momentRouter.post("/", verifyAuth, create);
// 查询多条动态数据
momentRouter.get("/", list);
// 获取动态详情(单个)
momentRouter.get("/:momentId", detail);

// 更新动态
// 1.用户必须登录， 2.用户必须拥有权限
momentRouter.patch("/:momentId", verifyAuth, verifyPermission, update);

// 删除动态
momentRouter.delete("/:momentId", verifyAuth, verifyPermission, remove);

// 给动态添加标签
momentRouter.post(
  "/:momentId/labels",
  verifyAuth,
  verifyPermission,
  verifyLabelExists,
  addLabels
);

// 动态配图服务
momentRouter.get("/images/:filename", fileInfo);

module.exports = momentRouter;
