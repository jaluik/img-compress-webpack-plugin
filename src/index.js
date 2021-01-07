const ora = require('ora');
const { validate } = require('schema-utils');
const Compressor = require('./tinyCompress');
const schema = require('./schema');

module.exports = class ImgCompressPlugin {
  constructor(opts) {
    this.opts = opts;
    this.compressor = new Compressor();
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
        if (!imgs.length) return Promise.resolve();
        const promises = imgs.map((img) =>
          this.compressor.compressImg(compilation.assets, img)
        );
        const spinner = ora('Image is compressing...').start();
        return Promise.all(promises)
          .then((res) => {
            spinner.stop();
            logged && res.forEach((v) => console.log(v));
          })
          .catch((err) => {
            console.log(err);
          });
      });
  }
};
