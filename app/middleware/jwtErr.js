/*
 * @Author: WangYunHong 18788604629@163.com
 * @Date: 2025-11-03 11:19:42
 * @LastEditors: WangYunHong 18788604629@163.com
 * @LastEditTime: 2025-11-03 11:35:21
 * @FilePath: /tally_book_server/app/middleware/jwtErr.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
module.exports = secret => {
  return async function jwtErr(ctx, next) {
    const token = ctx.request.header.authorization;
    if (!token) {
      ctx.body = {
        code: 401,
        message: 'token不存在',
        data: null,
      };
      return;
    }
    try {
      const decode = await ctx.app.jwt.verify(token, secret);
      await next();
    } catch (error) {
      ctx.body = {
        code: 401,
        message: 'token过期，请重新登陆',
        data: null,
      };
      return;
    }
  };
};
