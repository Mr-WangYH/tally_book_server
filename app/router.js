/*
 * @Author: WangYunHong 18788604629@163.com
 * @Date: 2025-10-30 11:12:52
 * @LastEditors: WangYunHong 18788604629@163.com
 * @LastEditTime: 2025-10-31 17:06:44
 * @FilePath: /tally_book_server/app/router.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/user/', controller.home.getUser);
  router.post('/addUser', controller.home.addUser);
  router.post('/editUser', controller.home.editUser);
  router.post('/deleteUser', controller.home.deleteUser);
  router.post('/api/user/register', controller.user.register);
};
