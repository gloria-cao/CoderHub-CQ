const fs = require("fs");

// const momentService = require("../service/moment.service");
const authService = require("../service/auth.service");
const momentService = require("../service/moment.service");
const fileService = require("../service/file.service");
const { PICTURE_PATH } = require("../constants/file-path");

class MomentController {
  // 发布动态
  async create(ctx, next) {
    // 1.获取数据(user_id, content)
    const userId = ctx.user.id;
    const content = ctx.request.body.content;
    console.log("插入数据库前操作", userId, content);

    // 2.将数据插入到数据库中
    const result = await momentService.create(userId, content);
    ctx.body = result;
  }
  // 查询单条动态数据
  async detail(ctx, next) {
    // 1.获取数据(momentId)
    const momentId = ctx.params.momentId;

    // 2.根据id去数据库中查询该条数据
    const result = await momentService.getMomentById(momentId);
    ctx.body = result;
  }

  // 查询多条动态数据
  async list(ctx, next) {
    // 1.获取数据(offset， size)
    const { offset, size } = ctx.query;

    // 2.查询列表
    const result = await momentService.getMomentList(offset, size);
    ctx.body = result;
  }

  // 更新数据
  async update(ctx, next) {
    // 1.获取参数
    const { momentId } = ctx.params;
    const { content } = ctx.request.body;
    // const { id } = ctx.user;

    // 2.修改数据库内容
    const result = await momentService.update(content, momentId);
    ctx.body = result;
  }

  // 删除动态
  async remove(ctx, next) {
    // 1.获取momentId
    const { momentId } = ctx.params;

    // 2.删除内容
    const result = await authService.remove(momentId);
    return result;
  }

  // 给动态添加标签
  async addLabels(ctx, next) {
    const { labels } = ctx;
    const { momentId } = ctx.params;

    // 添加所有标签
    for (let label of labels) {
      // 2.1 判断标签是否已经和动态有关系
      const isExist = await momentService.hasLabel(momentId, label.id);
      if (!isExist) {
        await momentService.addLabel(momentId, label.id);
      }
    }
    ctx.body = "添加标签成功~";
  }

  // 动态配图
  async fileInfo(ctx, next) {
    // const { filename } = ctx.params;
    // const fileInfo = await fileService.getFileByFilename(filename);
    // const { type } = ctx.query;
    // const types = ["small", "middle", "large"];
    // if (types.some((item) => item === type)) {
    //   filename = filename + "-" + type;
    // }

    // ctx.response.set("content-type", fileInfo.mimetype);
    // ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}`);
    let { filename } = ctx.params;
    const fileInfo = await fileService.getFileByFilename(filename);
    const { type } = ctx.query;
    const types = ["small", "middle", "large"];
    if (types.some((item) => item === type)) {
      filename = filename + "-" + type;
    }

    ctx.response.set("content-type", fileInfo.mimetype);
    ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}`);
  }
}
module.exports = new MomentController();
