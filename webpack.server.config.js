// Work around for https://github.com/angular/angular-cli/issues/7200

const path = require("path");
const webpack = require("webpack");
const { AngularCompilerPlugin } = require('@ngtools/webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  mode: "none",
  entry: {
    // This is our Express server for Dynamic universal
    server: "./server.ts",
  },
  externals: {
    "./dist/server/main": 'require("./server/main")',
  },
  target: "node",
  resolve: { extensions: [".ts", ".js"] },
  optimization: {
    minimize: false,
  },
  output: {
    // Puts the output at the root of the dist folder
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
  },
  module: {
    noParse: /polyfills-.*\.js/,
    rules: [
      { test: /\.ts$/, loader: "ts-loader" },
      {
        // Mark files inside `@angular/core` as using SystemJS style dynamic imports.
        // Removing this will cause deprecation warnings to appear.
        test: /(\\|\/)@angular(\\|\/)core(\\|\/).+\.js$/,
        parser: { system: true },
      },
    ],
  },
  optimization: {
    usedExports: true,
    splitChunks: {
      chunks: "all",
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: "~",
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [
    new webpack.ContextReplacementPlugin(
      // fixes WARNING Critical dependency: the request of a dependency is an expression
      /(.+)?angular(\\|\/)core(.+)?/,
      path.join(__dirname, "src"), // location of your src
      {} // a map of your routes
    ),
    new webpack.ContextReplacementPlugin(
      // fixes WARNING Critical dependency: the request of a dependency is an expression
      /(.+)?express(\\|\/)(.+)?/,
      path.join(__dirname, "src"),
      {}
    ),
    new BundleAnalyzerPlugin(),
    new AngularCompilerPlugin({
      // This option specifies the Angular module to be loaded on demand
      entryModule: path.join(__dirname, "src/app/app.module#AppModule"),
      tsConfigPath: path.join(__dirname, 'tsconfig.json'),
      skipCodeGeneration: true,
      sourceMap: true,
      compilerOptions: {
        enableIvy: true,
        fullTemplateTypeCheck: true,
        strictInjectionParameters: true,
        enableTreeShaking: true
      }
    }),
  ],
};
