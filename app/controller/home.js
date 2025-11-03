/*
 * @Author: WangYunHong 18788604629@163.com
 * @Date: 2025-10-30 11:12:52
 * @LastEditors: WangYunHong 18788604629@163.com
 * @LastEditTime: 2025-10-30 17:19:16
 * @FilePath: /tally_book_server/app/controller/home.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    // const { id } = ctx.query;
    // if (id) {
    //   ctx.body = id;
    // } else {
    //   ctx.body = 'hi, egg';
    // }
    await ctx.render('index.html', { title: 'Hello World' });
  }

  async getUser() {
    const { ctx } = this;
    // const { id } = ctx.params;
    const result = await ctx.service.home.user();
    ctx.body = result;
  }

  async addUser() {
    const { ctx } = this;
    const { name } = ctx.request.body;
    try {
      const result = await ctx.service.home.addUser(name);
      ctx.body = {
        code: 200,
        message: '添加成功',
        data: result,
      };
    } catch (error) {
      console.error(error);
      ctx.body = {
        code: 500,
        message: '添加失败',
        data: null,
      };
    }
  }

  async editUser() {
    const { ctx } = this;
    const { id, name } = ctx.request.body;
    try {
      const result = await ctx.service.home.editUser(id, name);
      ctx.body = {
        code: 200,
        message: '编辑成功',
        data: result,
      };
    } catch (error) {
      console.error(error);
      ctx.body = {
        code: 500,
        message: '编辑失败',
        data: null,
      };
    }
  }

  async deleteUser() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    try {
      const result = await ctx.service.home.deleteUser(id);
      ctx.body = {
        code: 200,
        message: '删除成功',
        data: result,
      };
    } catch (error) {
      console.error(error);
      ctx.body = {
        code: 500,
        message: '删除失败',
        data: null,
      };
    }
  }
}

module.exports = HomeController;
