const Router = require("koa-router");

const labelRouter = new Router({ prefix: "/label" });

const {
  verifyAuth
} = require('../middleware/auth.middlieware')

const {
  create,
  list
} = require('../controller/label.controller.js')

labelRouter.post("/", verifyAuth, create);
labelRouter.get("/", list);

module.exports = labelRouter;
