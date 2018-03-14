var path = require('path');

module.exports = {

    entry: ['babel-polyfill',path.resolve(__dirname, 'src') + '/app/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist') + '/app',
        filename: 'bundle.js',
        publicPath: '/app/'
    },
    module: {


        loaders: [
          {test: /\.json$/, loader: "json"},
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015',"stage-0"],
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            }
        ]
    }
};
