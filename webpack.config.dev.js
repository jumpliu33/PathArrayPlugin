const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin")
module.exports = (env, argv) => ({
    mode: 'development',
    devtool: "inline-source-map",
    // 入口
    entry: {
        main: './src/main/main.ts', // 插件代码入口起点
        page: './src/view/index.tsx', // UI代码入口起点
    },
    // 出口
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist/dev/src'),
        publicPath: '/'
    },
    // 模块
    module: {
        rules: [
            { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },

            { test: /\.css$/, use: ['style-loader', { loader: 'css-loader' }] },

            // 在HTML代码中使用require，例如"<%= require('./file.svg') %>， 从而获得一个data URI。
            { test: /\.(png|jpg|gif|webp|svg)$/, use: [{ loader: 'url-loader', options: { esModule: false } }] },
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, './dist/dev/src/ui.html'),
            template: 'src/view/html/ui.html',
            inject: true,
            inlineSource: '.(js)$',
            chunks: ["page"]
        })
    ],

    // 如果遗漏扩展名，例如"import './file'"， Webpack将按以下顺序尝试扩展。
    resolve: { extensions: ['.tsx', '.ts', '.jsx', '.js'] },

    devServer: {
        hot: true,
        port: "8082",
        open: true,
        contentBase: 'dist/dev/src',
        proxy: {
            // 接口请求代理
        }
    }
})