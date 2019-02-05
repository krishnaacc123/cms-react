var path = require('path');
var hwp = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        app: path.join(__dirname, '/src/index.js'),
        cms: path.join(__dirname, '/src/cms/cms.js')
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, '/dist')
    },
    module:{
        rules:[{
            exclude: /node_modules/,
            test: /\.js$/,
            loader: 'babel-loader'
        },{
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
        }]
    },
    plugins:[
        new hwp({template:path.join(__dirname, '/src/index.html')}),
        new CopyWebpackPlugin([
            { from: 'static' },
            { from: 'src/cms/style.css', to: 'admin'},
            { from: 'src/cms/prism.css', to: 'admin'}
        ])
    ]
}