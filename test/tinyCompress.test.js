const Compressor = require('../src/tinyCompress');
const fs = require('fs');
const rmRf = require('rimraf');
const path = require('path');

describe('method test', () => {
  afterAll((done) => {
    rmRf(path.resolve(__dirname, 'net.png'), done);
  });
  test('it can upload a img', async (done) => {
    const file = fs.readFileSync(
      path.resolve(__dirname, 'src/net.png'),
      'binary'
    );
    res = await new Compressor().uploadImg(file);
    done();
    expect(res.output.url).not.toBeNull();
  });

  test('it can download a img', async (done) => {
    const fileUrl =
      'https://tinypng.com/web/output/9nutf37pek39dzj7dvx7ywc11qdufrqe';
    const file = await new Compressor().downloadImg(fileUrl);
    fs.writeFileSync(path.resolve(__dirname, 'net.png'), file, 'binary');
    done();
    expect(file).not.toBeNull();
  });
});
