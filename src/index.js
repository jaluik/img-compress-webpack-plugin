const fs = require('fs');
const https = require('https');
const url = require('url');
const chalk = require('chalk');
const ora = require('ora');
const figures = require('figures');
const { randomHeader } = require('../util/setting');
const { validate } = require('schema-utils');
const schema = require('./schema');

module.exports = class ImgCompressPlugin {
  constructor(opts) {
    this.opts = opts;
  }

  apply(compiler) {
    const pluginName = 'img-compress-webpack-plugin';
    const { enabled, logged } = this.opts;
    validate(schema, this.opts, { name: pluginName });
    enabled &&
      compiler.hooks.emit.tap(pluginName, (compilation) => {
        const imgs = Object.keys(compilation.assets).filter((img) =>
          /.png|jpg/.test(img)
        );
        console.log('执行了');
        if (!imgs.length) return Promise.resolve();
        const promises = imgs.map((img) =>
          this.compressImg(compilation.assets, img)
        );
        const spinner = ora('Image is compressing...').start();
        return Promise.all(promises).then((res) => {
          spinner.stop();
          logged && res.forEach((v) => console.log(v));
        });
      });
  }
  async compressImg(assets, path) {
    try {
      const file = assets[path].source();
      const obj = await this.uploadImg(file);
      const data = await this.downloadImg(obj.output.url);
      const oldSize = chalk.redBright(obj.input.size);
      const newSize = chalk.greenBright(obj.output.size);
      const ratio = chalk.blueBright(obj.output.ratio);
      const dPath = assets[path].existsAt;
      const msg = `${figures.tick} Compressed [${chalk.yellowBright(
        dPath
      )}] completed : Old Size: ${oldSize} , New Size: ${newSize}, Optimize Ration: ${ratio}`;
      fs.writeFileSync(dPath, data, 'binary');
      return Promise.resolve(msg);
    } catch (err) {
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
          const obj = JSON.stringify(data.toString());
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
};
