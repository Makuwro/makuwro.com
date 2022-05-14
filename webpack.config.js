const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const config = {
  resolve: {
    fallback: { 
      zlib: require.resolve("browserify-zlib"),
      url: require.resolve("url"),
      crypto: require.resolve("crypto-browserify"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer/"),
      assert: require.resolve("assert/"),
      util: require.resolve("util/")
    }
  },
  devServer: {
    port: 3000,
    historyApiFallback: true
  },
  entry: [
    "./src/client.js"
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader"
        ],
        exclude: /\.module\.css$/
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: "[name]-[local]"
              }
            }
          }
        ],
        include: /\.module\.css$/
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html",
      favicon: "public/favicon.ico"
    })
  ]
};

module.exports = config;