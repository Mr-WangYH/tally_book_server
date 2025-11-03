/*
 * @Author: WangYunHong 18788604629@163.com
 * @Date: 2025-10-31 16:49:02
 * @LastEditors: WangYunHong 18788604629@163.com
 * @LastEditTime: 2025-11-03 09:29:34
 * @FilePath: /tally_book_server/app/controller/user.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { Controller } = require('egg');

const defaultAvatar = 'http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png'

class UserController extends Controller {
  // 注册
  async register() {
    const { ctx } = this;
    const { userName, passWord } = ctx.request.body;
    try {
      if (!userName || !passWord) {
        ctx.body = {
          code: 500,
          message: '用户名和密码不能为空',
          data: null,
        };
        return;
      }
      const userInfo = await ctx.service.user.getUserByName(userName);
      if (userInfo && userInfo.id) {
        ctx.body = {
          code: 500,
          message: '用户名已存在',
          data: null,
        };
        return;
      }
      const result = await ctx.service.user.register({
        userName,
        passWord,
        avatar: defaultAvatar,
        signature: '世界和平。',
        createTime: new Date(),
      });
      if (result) {
        ctx.body = {
          code: 200,
          message: '注册成功',
          data: result,
        };
      } else {
        ctx.body = {
          code: 500,
          message: '注册失败',
          data: null,
        };
      }
    } catch (error) {
      console.error(error);
      ctx.body = {
        code: 500,
        message: '注册失败',
        data: null,
      };
    }
  }

  // 登录
  async login() {
    const { ctx } = this;
    const { userName, passWord } = ctx.request.body;    
    try {
      const token = ctx.app.jwt.sign({
        userName,
        passWord,
      }, ctx.app.config.jwt.secret);
      ctx.body = {
        code: 200,
        message: '登录成功',
        data: token,
      };
    } catch (error) {
      console.error(error);
      ctx.body = {
        code: 500,
        message: '登录失败',
        data: null,
      };
    }
  }
}

module.exports = UserController;

