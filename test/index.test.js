const fs = require('fs');
const webpack = require('webpack');
const path = require('path');
const OUTPUT_DIR = path.join(__dirname, './tmp');

test('a good plugin', async (done) => {
  const ImgCompressWebpackPlugin = require('../src/index');
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
          use: [{ loader: 'url-loader' }],
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
    console.log(err);
    expect(err).toBeNull();
  });
});
