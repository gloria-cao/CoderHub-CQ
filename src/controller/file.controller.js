const fileService = require("../service/file.service");
const userService = require("../service/user.service");
const { AVATAR_PATH } = require("../constants/file-path");
const { APP_HOST, APP_PORT } = require("../app/config");

class FileController {
  // 保存头像相关信息
  async saveAvatarInfo(ctx, next) {
    // 1.获取图像相关信息

    const { filename, mimetype, size } = ctx.req.file;
    const { id } = ctx.user;
    // 2.将图像信息保存到数据库中
    const result = await fileService.createAvatar(filename, mimetype, size, id);

    // 3.将图片地址保存到user表中
    // const avatarUrl = `${APP_HOST}:${APP_PORT}/users/${id}/avatar`;
    const avatarUrl = `${APP_HOST}:${APP_PORT}/users/${id}/avatar`;
    // const avatarUrl = `${AVATAR_PATH}/${filename}`;
    await userService.updateAvatarUrlById(avatarUrl, id);

    // 4.返回结果
    ctx.body = "上传头像成功~";
  }

  // 上传头像组
  async savePictureInfo(ctx, next) {
    // // 1.获取图像信息
    // const files = ctx.req.files;
    // const { id } = ctx.user;
    // const { momentId } = ctx.query;
    // console.log(filename, mimetype, size);

    // // 2.将所有的文件信息保存到数据库中
    // for (let file of files) {
    //   const { filename, mimetype, size } = file;
    //   await fileService.createFile(filename, mimetype, size, id, momentId);
    // }
    // 1.获取图像信息
    const files = ctx.req.files;
    const { id } = ctx.user;
    const { momentId } = ctx.query;
    // console.log(momentId);

    // 2.将所有的文件信息保存到数据库中
    for (let file of files) {
      const { filename, mimetype, size } = file;
      await fileService.createFile(filename, mimetype, size, id, momentId);
    }

    ctx.body = "动态配图上传完成~";
  }
}

module.exports = new FileController();
