const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
      entry: './src/index.tsx',
      output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'bundle.js',
            clean: true,
      },
      module: {
            rules: [
                  {
                        test: /\.(js|jsx|ts|tsx)$/,
                        exclude: /node_modules/,
                        use: 'babel-loader',
                  },
                  {
                        test: /\.css$/,
                        use: ['style-loader', 'css-loader'],
                  },
            ],
      },
      resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      plugins: [
            new HtmlWebpackPlugin({
                  template: './src/index.html',
            }),
      ],
      devServer: {
            static: './dist',
            port: 3000,
            open: true,
            historyApiFallback: true,
      },
      mode: 'development',
};