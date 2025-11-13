/*
 * @Author: WangYunHong 18788604629@163.com
 * @Date: 2025-10-31 16:49:02
 * @LastEditors: WangYunHong 18788604629@163.com
 * @LastEditTime: 2025-11-03 15:59:39
 * @FilePath: /tally_book_server/app/controller/user.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { Controller } = require('egg');

const defaultAvatar = 'http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png';

class UserController extends Controller {
  // 注册
  async register() {
    const { ctx } = this;
    const { userName, password } = ctx.request.body;
    try {
      if (!userName || !password) {
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
        password,
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
    const { ctx, app } = this;
    const { userName, password } = ctx.request.body;
    try {
      const userInfo = await ctx.service.user.getUserByName(userName);
      if (!userInfo || !userInfo.id) {
        ctx.body = {
          code: 500,
          message: '账号不存在',
          data: null,
        };
        return;
      }
      if (userInfo && userInfo.password !== password) {
        ctx.body = {
          code: 500,
          message: '密码错误',
          data: null,
        };
        return;
      }
      const token = app.jwt.sign({
        id: userInfo.id,
        userName: userInfo.userName,
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
      }, ctx.app.config.jwt.secret);
      ctx.body = {
        code: 200,
        message: '登录成功',
        data: {
          token,
        },
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

  // 获取用户信息
  async getUserInfo() {
    const { ctx, app } = this;
    // 通过 token 解析，拿到 user_id
    const token = ctx.request.header.authorization; // 请求头获取 authorization 属性，值为 token
    // 通过 app.jwt.verify + 加密字符串 解析出 token 的值
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    const userInfo = await ctx.service.user.getUserByName(decode.userName);
    // 响应接口
    ctx.body = {
      code: 200,
      message: '请求成功',
      data: {
        ...userInfo,
      },
    };
  }


  async editUserInfo() {
    const { ctx, app } = this;
    const { signature = '', avatar = '' } = ctx.request.body;
    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode || !decode.id) {
        ctx.body = {
          code: 500,
          message: '用户不存在',
          data: null,
        };
        return;
      }
      const userInfo = await ctx.service.user.getUserByName(decode.userName);
      await ctx.service.user.editUserInfo({
        ...userInfo,
        signature,
        avatar,
      });
      ctx.body = {
        code: 200,
        message: '编辑成功',
        data: {
          id: userInfo.id,
          signature,
          avatar,
          username: userInfo.userName,
        },
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
}

module.exports = UserController;

