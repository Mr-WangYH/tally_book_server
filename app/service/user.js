/*
 * @Author: WangYunHong 18788604629@163.com
 * @Date: 2025-10-31 16:53:25
 * @LastEditors: WangYunHong 18788604629@163.com
 * @LastEditTime: 2025-11-03 14:16:25
 * @FilePath: /tally_book_server/app/service/user.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { Service } = require('egg');

class UserService extends Service {
  async getUserByName(userName) {
    const { app } = this;
    try {
      const result = await app.mysql.get('user', { userName });
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async register(params) {
    const { app } = this;
    try {
      const result = await app.mysql.insert('user', params);
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async editUserInfo(params) {
    const { app } = this;
    try {
      const result = await app.mysql.update('user', params, { where: { id: params.id } });
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

module.exports = UserService;
