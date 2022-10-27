const connection = require("../app/database");

class MomentService {
  async create(userId, content) {
    const statement = "INSERT INTO moment (content, user_id) VALUES (?, ?);";
    const [result] = await connection.execute(statement, [content, userId]);
    return result;
  }

  // 获取单条动态详情
  async getMomentById(id) {
    const statement = `
    SELECT 
      m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
      JSON_OBJECT('id', u.id, 'name', u.name, 'avatarUrl', u.avatar_url) author,
      IF(COUNT(l.id),JSON_ARRAYAGG(
        JSON_OBJECT('id', l.id, 'name', l.name)
      ),NULL) labels,
      (SELECT IF(COUNT(c.id),JSON_ARRAYAGG(
        JSON_OBJECT('id', c.id, 'content', c.content, 'commentId', c.comment_id, 'createTime', c.createAt,
                    'user', JSON_OBJECT('id', cu.id, 'name', cu.name, 'avatarUrl', u.avatar_url))
      ),NULL) FROM comment c LEFT JOIN users cu ON c.user_id = cu.id WHERE m.id = c.moment_id) comments,
      (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8000/moment/images/', file.filename)) 
	    FROM file WHERE m.id = file.moment_id) images
    FROM moment m
    LEFT JOIN users u ON m.user_id = u.id
    LEFT JOIN moment_label ml ON m.id = ml.moment_id
    LEFT JOIN label l ON ml.label_id = l.id
    WHERE m.id = 1
    GROUP BY m.id;  
  `;
    const [result] = await connection.execute(statement, [id]);
    // 查询出来是对象
    return result[0];
  }

  // 获取动态列表
  async getMomentList(offset, size) {
    const statement = `
    SELECT 
      m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
      JSON_OBJECT('id', u.id, 'name', u.name) author,
      (SELECT COUNT(*) FROM comment c WHERE c.moment_id = m.id) commentCount,
      (SELECT COUNT(*) FROM moment_label ml WHERE ml.moment_id = m.id) labelCount,
      (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8000/moment/images/', file.filename)) 
	    FROM file WHERE m.id = file.moment_id) images
    FROM moment m
    LEFT JOIN users u ON m.user_id = u.id
    LIMIT ?, ?;
    `;
    const [result] = await connection.execute(statement, [offset, size]);
    return result;
  }

  // 修改动态
  async update(content, momentId) {
    const statement = `UPDATE moment SET content = ? WHERE id = ?;`;
    const [result] = await connection.execute(statement, [content, momentId]);
    return result;
  }

  // 删除动态
  async remove(momentId) {
    const statement = `DELETE FROM moment WHERE id = ?;`;
    const [result] = await connection.execute(statement, [momentId]);
    return result;
  }

  // 判断标签是否存在
  async hasLabel(momentId, labelId) {
    const statement = `SELECT * FROM moment_label WHERE moment_id = ? AND label_id = ?`;
    const [result] = await connection.execute(statement, [momentId, labelId]);
    return result[0] ? true : false;
  }

  async addLabel(momentId, labelId) {
    const statement = `INSERT INTO moment_label (moment_id, label_id) VALUES (?, ?);`;
    const [result] = await connection.execute(statement, [momentId, labelId]);
    return result;
  }
}

module.exports = new MomentService();
