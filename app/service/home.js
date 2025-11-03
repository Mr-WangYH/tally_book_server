/*
 * @Author: WangYunHong 18788604629@163.com
 * @Date: 2025-10-30 14:36:32
 * @LastEditors: WangYunHong 18788604629@163.com
 * @LastEditTime: 2025-10-30 17:17:41
 * @FilePath: /tally_book_server/app/service/home.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { Service } = require('egg');

class HomeService extends Service {
  async user() {
    const { app } = this;
    const QUERY_STR = 'id, name';
    const sql = `select ${QUERY_STR} from list`;
    try {
      const result = await app.mysql.query(sql);
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async addUser(name) {
    const { ctx, app } = this;
    try {
        const result = await app.mysql.insert('list', { name });
        return result;
    } catch (error) {
        console.error(error);
        return null;
    }
  }

  async editUser(id, name) {
    const { ctx, app } = this;
    try {
      const result = await app.mysql.update('list', { name }, { where: { id } });
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async deleteUser(id) {
    const { app } = this;
    try {
      const result = await app.mysql.delete('list', { id });
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

module.exports = HomeService;
