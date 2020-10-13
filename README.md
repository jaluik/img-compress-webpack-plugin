# img-compress-webpack-plugin

> `img-compress-webpack-plugin`是一款十分轻量的 webpack 插件，利用 tinypng 网站优秀的压缩算法，对图片格式进行压缩

### 安装

`npm i -D img-compress-webpack-plugin` 或 `yarn add -D img-compress-webpack-plugin`

### 使用

| 配置      | 功能         | 格式         |
| --------- | ------------ | ------------ |
| `enabled` | 是否启用插件 | `true/false` |
| `logged`  | 是否打印日志 | `true/false` |

### 使用

```js
const ImgCompressWebpackPlugin = require('img-compress-webpack-plugin');

module.exports = {
  plugins: [
    new ImgCompressWebpackPlugin({
      enabled: true,
      logged: true,
    }),
  ],
};
```
