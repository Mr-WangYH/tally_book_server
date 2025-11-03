/*
 * @Author: WangYunHong 18788604629@163.com
 * @Date: 2025-10-30 11:12:52
 * @LastEditors: WangYunHong 18788604629@163.com
 * @LastEditTime: 2025-10-31 17:27:02
 * @FilePath: /tally_book_server/config/plugin.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  ejs: {
    enable: true,
    package: 'egg-view-ejs',
  },
  mysql: {
    enable: true,
    package: 'egg-mysql',
  },
  jwt: {
    enable: true,
    package: 'egg-jwt',
  },
};
