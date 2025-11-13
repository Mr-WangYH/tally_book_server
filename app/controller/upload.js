/*
 * @Author: WangYunHong 18788604629@163.com
 * @Date: 2025-11-03 14:27:38
 * @LastEditors: WangYunHong 18788604629@163.com
 * @LastEditTime: 2025-11-03 15:21:07
 * @FilePath: /tally_book_server/app/controller/upload.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { mkdirp } = require('mkdirp');

const { Controller } = require('egg');

class UploadController extends Controller {
  async upload() {
    const { ctx } = this;
    console.log('ctx.request.files', ctx.request.files);
    const file = ctx.request.files[0];

    let uploadDir = '';

    try {
      const f = fs.readFileSync(file.filepath);

      const day = moment(new Date()).format('YYYYMMDD');

      const dir = path.join(this.config.uploadDir, day);

      const date = Date.now();

      await mkdirp(dir);

      uploadDir = path.join(dir, date + path.extname(file.filename));

      fs.writeFileSync(uploadDir, f);
    } finally {
      ctx.cleanupRequestFiles();
    }

    ctx.body = {
      code: 200,
      message: '上传成功',
      data: uploadDir.replace(/app/g, ''),
    };
  }
}

module.exports = UploadController;
