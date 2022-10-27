const Router = require("koa-router");

const { verifyAuth } = require("../middleware/auth.middlieware");
const {
  avatarHandler,
  pictureHandler,
  pictureResize
} = require("../middleware/file.middlieware");

const {
  saveAvatarInfo,
  savePictureInfo,
} = require("../controller/file.controller");

const fileRouter = new Router({ prefix: "/upload" });

fileRouter.post("/avatar", verifyAuth, avatarHandler, saveAvatarInfo);
fileRouter.post(
  "/picture",
  verifyAuth,
  pictureHandler,
  pictureResize,
  savePictureInfo
);

module.exports = fileRouter;
