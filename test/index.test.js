const webpack = require('webpack');
const path = require('path');
const rmRf = require('rimraf');
const OUTPUT_DIR = path.join(__dirname, './tmp');

describe('Plugin', () => {
  afterAll((done) => {
    rmRf(OUTPUT_DIR, done);
  });
  it('should work to compress', async (done) => {
    const ImgCompressWebpackPlugin = require(path.resolve(
      __dirname,
      '../src/index.js'
    ));
    const webpackConfig = {
      entry: {
        one: path.join(__dirname, 'src/index.js'),
      },
      output: {
        path: OUTPUT_DIR,
        filename: 'bundle.js',
      },
      module: {
        rules: [
          {
            test: /\.(jpe?g|png)$/,
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: false,
                },
              },
            ],
          },
        ],
      },
      plugins: [
        new ImgCompressWebpackPlugin({
          enabled: true,
          logged: true,
        }),
      ],
    };
    webpack(webpackConfig, (err, stat) => {
      done();
      expect(err).toBeNull();
      expect(stat.hasErrors()).toBeFalsy();
    });
  }, 30000);
});
