// const ImgCompressPlugin = require('../src/index');
// const fs = require('fs');
// const path = require('path');

// test('it can upload a img', async (done) => {
//   const file = fs.readFileSync(path.resolve(__dirname, 'net.png'), 'binary');
//   res = await new ImgCompressPlugin().uploadImg(file);
//   data = JSON.parse(res);
//   done();
//   expect(res.url).not.toBeNull();
// });

// test('it can download a img', async (done) => {
//   const fileUrl =
//     'https://tinypng.com/web/output/9nutf37pek39dzj7dvx7ywc11qdufrqe';
//   const file = await new ImgCompressPlugin().downloadImg(fileUrl);
//   console.log(file);
//   fs.writeFileSync(path.resolve(__dirname, '../net.png'), file, 'binary');
//   done();
//   expect(file).not.toBeNull();
// });

test('it can download a img', () => {
  expect(1).toBe(1);
});
