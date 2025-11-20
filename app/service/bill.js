/*
 * @Author: WangYunHong 18788604629@163.com
 * @Date: 2025-11-14 15:58:58
 * @LastEditors: WangYunHong 18788604629@163.com
 * @LastEditTime: 2025-11-18 16:56:33
 * @FilePath: /tally_book_server/app/service/bill.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { Service } = require('egg');

class BillService extends Service {
  async add(params) {
    const { app } = this;
    const result = await app.mysql.insert('bill', params);
    return result;
  }

  async list(id) {
    const { app } = this;
    const QUERY_STR = 'id, pay_type, amount, date, type_id, type_name, remark';
    const sql = `select ${QUERY_STR} from bill where user_id = ${id}`;
    try {
      const result = await app.mysql.query(sql);
      return result;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async detail(id, user_id) {
    const { app } = this;
    try {
      const result = await app.mysql.get('bill', { id, user_id });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async update(params) {
    const { app } = this;
    try {
      const result = await app.mysql.update('bill', params, { where: { id: params.id, user_id: params.user_id } });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async delete(id, user_id) {
    const { app } = this;
    try {
      const result = await app.mysql.delete('bill', { id, user_id });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

}

module.exports = BillService;
