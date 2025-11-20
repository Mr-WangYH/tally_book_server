/*
 * @Author: WangYunHong 18788604629@163.com
 * @Date: 2025-10-30 11:12:52
 * @LastEditors: WangYunHong 18788604629@163.com
 * @LastEditTime: 2025-11-19 17:18:35
 * @FilePath: /tally_book_server/app/router.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const jwtErr = middleware.jwtErr(app.config.jwt.secret);
  router.post('/api/user/register', controller.user.register);
  router.post('/api/user/login', controller.user.login);
  router.get('/api/user/getUserInfo', jwtErr, controller.user.getUserInfo);
  router.post('/api/user/editUserInfo', jwtErr, controller.user.editUserInfo);
  router.post('/api/upload', jwtErr, controller.upload.upload);

  // 账单类
  router.post('/api/bill/add', jwtErr, controller.bill.add);
  router.get('/api/bill/list', jwtErr, controller.bill.list);
  router.get('/api/bill/detail', jwtErr, controller.bill.detail);
  router.post('/api/bill/update', jwtErr, controller.bill.update);
  router.post('/api/bill/delete', jwtErr, controller.bill.delete);
  router.get('/api/bill/data', jwtErr, controller.bill.data);
};
