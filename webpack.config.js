const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const InlineChunkHtmlPlugin = require('@kudashi/kds-inline-chunk-html-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path')
const { runtime, javascript } = require('webpack')

module.exports = (env, argv) => ({
  mode: argv.mode === 'production' ? 'production' : 'development',

  devtool: argv.mode === 'production' ? false : "inline-source-map",

  entry: {
    main: './src/main/main.ts', // 插件代码入口起点
    page: './src/view/index.tsx', // UI代码入口起点
    // ui: './src/view/ui.ts', // UI代码入口起点
  },

  module: {
    rules: [
      // 转换TypeScript代码为TypeScript代码。
      { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },

      {
        test: /\.(js|jsx)$/,//一个匹配loaders所处理的文件的拓展名的正则表达式，这里用来匹配js和jsx文件（必须）
        exclude: /(node_modules|bower_components)/,//屏蔽不需要处理的文件（文件夹）（可选）
        loader: 'babel-loader',//loader的名称（必须）
      },

      // 在TypeScript包含CSS，例如"import './file.css'"。
      { test: /\.css$/, use: ['style-loader', { loader: 'css-loader' }] },

      // 在HTML代码中使用require，例如"<%= require('./file.svg') %>， 从而获得一个data URI。
      { test: /\.(png|jpg|gif|webp|svg)$/, use: [{ loader: 'url-loader', options: { esModule: false } }] },
    ],
  },

  // 如果遗漏扩展名，例如"import './file'"， Webpack将按以下顺序尝试扩展。
  resolve: { extensions: ['.tsx', '.ts', '.jsx', '.js'] },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/prod/src'), // 编译后的代码目录为'dist'。
    publicPath: '/'
  },

  // 配置Webpack生成"ui.html", 并且将"ui.js"嵌入至其中。
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/view/html/ui.html',
      filename: 'ui.html',
      inlineSource: '.(js)$',
      chunks: ['page'],
      inject: true,
    }),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [runtime]),
  ],
})