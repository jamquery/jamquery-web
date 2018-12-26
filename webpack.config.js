const path = require("path");

module.exports = {
  // src-public/main.js -> public/dist/main.js
  entry: "./src-public/main.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "public/dist")
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            only: ["./src-public"]
          }
        }
      }
    ]
  }
};
