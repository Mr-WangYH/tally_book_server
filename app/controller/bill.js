/*
 * @Author: WangYunHong 18788604629@163.com
 * @Date: 2025-11-14 15:38:53
 * @LastEditors: WangYunHong 18788604629@163.com
 * @LastEditTime: 2025-11-19 17:16:32
 * @FilePath: /tally_book_server/app/controller/bill.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { Controller } = require('egg');
const moment = require('moment');

class BillController extends Controller {
  async add() {
    const { ctx, app } = this;
    const { amount, type_id, type_name, date, pay_type, remark = '' } = ctx.request.body;
    if (!amount || !type_id || !type_name || !date || !pay_type) {
      ctx.body = {
        code: 400,
        message: '参数不完整',
        data: null,
      };
      return;
    }
    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode || !decode.id) {
        ctx.body = {
          code: 401,
          message: '用户不存在',
          data: null,
        };
        return;
      }
      const user_id = decode.id;
      const result = await ctx.service.bill.add({
        user_id,
        amount,
        type_id,
        type_name,
        date,
        pay_type,
        remark,
      });
      ctx.body = {
        code: 200,
        message: '添加成功',
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        message: '添加失败',
        data: null,
      };
    }
  }

  async list() {
    const { ctx, app } = this;
    const { date, page = 1, page_size = 10, type_id = 'all' } = ctx.query;
    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode || !decode.id) {
        ctx.body = {
          code: 401,
          message: '用户不存在',
          data: null,
        };
        return;
      }
      const user_id = decode.id;
      const list = await ctx.service.bill.list(user_id);
      const _list = list.filter(item => {
        if (type_id !== 'all') {
          return moment(Number(item.date)).format('YYYY-MM') === date && item.type_id === type_id;
        }
        return moment(Number(item.date)).format('YYYY-MM') === date;
      });
      let listMap = _list.reduce((curr, item) => {
        const date = moment(Number(item.date)).format('YYYY-MM-DD');
        if (curr && curr.length && curr.findIndex(item => item.date === date) === -1) {
          curr.push({
            date,
            bills: [ item ],
          });
        }
        if (curr && curr.length && curr.findIndex(item => item.date === date) > -1) {
          const index = curr.findIndex(item => item.date === date);
          curr[index].bills.push(item);
        }
        if (!curr.length) {
          curr.push({
            date,
            bills: [ item ],
          });
        }
        return curr;
      }, []);
      listMap = listMap.sort((a, b) => moment(b.date) - moment(a.date));
      const filterListMap = listMap.slice((page - 1) * page_size, page * page_size);
      const allList = list.filter(item => moment(Number(item.date)).format('YYYY-MM') === date);
      const totalExpense = allList.reduce((curr, item) => {
        if (item.pay_type === 1) {
          curr += Number(item.amount);
          return curr;
        }
        return curr;
      }, 0);
      const totalIncome = allList.reduce((curr, item) => {
        if (item.pay_type === 2) {
          curr += Number(item.amount);
          return curr;
        }
        return curr;
      }, 0);
      ctx.body = {
        code: 200,
        message: '请求成功',
        data: {
          totalExpense,
          totalIncome,
          totalPage: Math.ceil(listMap.length / page_size),
          list: filterListMap || [],
        },
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        message: '系统错误',
        data: null,
      };
    }
  }

  async detail() {
    const { ctx, app } = this;
    const { id } = ctx.query;
    try {
      if (!id) {
        ctx.body = {
          code: 400,
          message: '订单id不能为空',
          data: null,
        };
        return;
      }
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode || !decode.id) {
        ctx.body = {
          code: 401,
          message: '用户不存在',
          data: null,
        };
        return;
      }
      const user_id = decode.id;
      const detail = await ctx.service.bill.detail(id, user_id);
      ctx.body = {
        code: 200,
        message: '请求成功',
        data: detail,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        message: '系统错误',
        data: null,
      };
    }
  }

  async update() {
    const { ctx, app } = this;
    const { id, amount, type_id, type_name, date, pay_type, remark = '' } = ctx.request.body;
    if (!id || !amount || !type_id || !type_name || !date || !pay_type) {
      ctx.body = {
        code: 400,
        message: '参数不完整',
        data: null,
      };
      return;
    }
    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode || !decode.id) {
        ctx.body = {
          code: 401,
          message: '用户不存在',
          data: null,
        };
        return;
      }
      const user_id = decode.id;
      const detail = await ctx.service.bill.detail(id, user_id);
      if (!detail) {
        ctx.body = {
          code: 400,
          message: '订单不存在',
          data: null,
        };
        return;
      }
      await ctx.service.bill.update({
        id,
        amount,
        type_id,
        type_name,
        date,
        pay_type,
        remark,
        user_id,
      });
      ctx.body = {
        code: 200,
        message: '更新成功',
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        message: '系统错误',
        data: null,
      };
    }
  }

  async delete() {
    const { ctx, app } = this;
    const { id } = ctx.request.body;
    if (!id) {
      ctx.body = {
        code: 400,
        message: '订单id不能为空',
        data: null,
      };
      return;
    }
    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode || !decode.id) {
        ctx.body = {
          code: 401,
          message: '用户不存在',
          data: null,
        };
        return;
      }
      const user_id = decode.id;
      const detail = await ctx.service.bill.detail(id, user_id);
      if (!detail) {
        ctx.body = {
          code: 400,
          message: '订单不存在',
          data: null,
        };
        return;
      }
      await ctx.service.bill.delete(id, user_id);
      ctx.body = {
        code: 200,
        message: '删除成功',
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        message: '系统错误',
        data: null,
      };
    }
  }

  async data() {
    const { ctx, app } = this;
    const { date } = ctx.query;
    if (!date) {
      ctx.body = {
        code: 400,
        message: '日期不能为空',
        data: null,
      };
      return;
    }
    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode || !decode.id) {
        ctx.body = {
          code: 401,
          message: '用户不存在',
          data: null,
        };
        return;
      }
      const user_id = decode.id;
      const list = await ctx.service.bill.list(user_id);
      const start = moment(date).startOf('month').valueOf();
      const end = moment(date).endOf('month').valueOf();
      const _list = list.filter(item => (Number(item.date)) >= start && (Number(item.date)) <= end);
      const total_expense = _list.reduce((curr, item) => {
        if (item.pay_type === 1) {
          curr += Number(item.amount);
          return curr;
        }
        return curr;
      }, 0);
      const total_income = _list.reduce((curr, item) => {
        if (item.pay_type === 2) {
          curr += Number(item.amount);
          return curr;
        }
        return curr;
      }, 0);
      let total_data = _list.reduce((curr, item) => {
        const index = curr.findIndex(_ => _.type_id === item.type_id);
        if (index === -1) {
          curr.push({
            type_id: item.type_id,
            type_name: item.type_name,
            pay_type: item.pay_type,
            amount: Number(item.amount),
          });
        }
        if (index > -1) {
          curr[index].amount += Number(item.amount);
        }
        return curr;
      }, []);
      total_data = total_data.map(item => {
        item.amount = Number(item.amount).toFixed(2);
        return item;
      });

      let bar_data = _list.reduce((curr, item) => {
        const index = curr.findIndex(_ => _.date === moment(Number(item.date)).format('YYYY-MM-DD'));
        if (index === -1) {
          curr.push({
            pay_type: item.pay_type,
            date: moment(Number(item.date)).format('YYYY-MM-DD'),
            amount: Number(item.amount),
          });
        }
        if (index > -1) {
          curr[index].amount += Number(item.amount);
        }
        return curr;
      }, []);
      bar_data = bar_data.map(item => {
        item.amount = Number(item.amount).toFixed(2);
        return item;
      });

      ctx.body = {
        code: 200,
        message: '请求成功',
        data: {
          total_expense: Number(total_expense).toFixed(2),
          total_income: Number(total_income).toFixed(2),
          total_data: total_data || [],
          bar_data: bar_data || [],
        },
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        message: '系统错误',
        data: null,
      };
    }
  }


}

module.exports = BillController;
