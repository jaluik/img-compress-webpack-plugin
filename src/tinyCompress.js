const fs = require('fs');
const https = require('https');
const url = require('url');
const chalk = require('chalk');
const figures = require('figures');
const { randomHeader } = require('../util/setting');
const { RawSource } = require('webpack-sources');

class Compressor {
  async compressImg(assets, path) {
    try {
      const file = assets[path].source();
      const obj = await this.uploadImg(file);
      const data = await this.downloadImg(obj.output.url);
      const oldSize = chalk.redBright(obj.input.size);
      const newSize = chalk.greenBright(obj.output.size);
      const ratio = chalk.blueBright(obj.output.ratio);
      assets[path] = new RawSource(Buffer.alloc(data.length, data, 'binary'));
      const msg = `${figures.tick} Compressed [${chalk.yellowBright(
        path
      )}] completed : Old Size: ${oldSize} , New Size: ${newSize}, Optimize Ration: ${ratio}`;
      console.log('assets[path]', assets[path]);
      return Promise.resolve(msg);
    } catch (err) {
      console.log(err);
      const msg = `${figures.cross} Compressed [${chalk.yellowBright(
        path
      )}] failed: ${chalk.redBright(err)}`;
      return Promise.resolve(msg);
    }
  }
  uploadImg(file) {
    const opts = randomHeader();
    return new Promise((resolve, reject) => {
      const req = https.request(opts, (res) => {
        res.on('data', (data) => {
          const obj = JSON.parse(data.toString());
          obj.error ? reject(obj.message) : resolve(obj);
        });
      });
      req.write(file, 'binary');
      req.on('error', (err) => {
        reject(err);
      });
      req.end();
    });
  }
  downloadImg(address) {
    const opts = new url.URL(address);
    return new Promise((resolve, reject) => {
      const req = https.request(opts, (res) => {
        let file = '';
        res.setEncoding('binary');
        res.on('data', (chunk) => (file += chunk));
        res.on('end', () => resolve(file));
      });
      req.on('error', (error) => reject(error));
      req.end();
    });
  }
}

module.exports = Compressor;
