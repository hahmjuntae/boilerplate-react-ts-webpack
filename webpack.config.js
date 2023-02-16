import path from 'path';

import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
// import CopyWebpackPlugin from 'copy-webpack-plugin';
import dotenv from 'dotenv';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const isDevelopment = process.env.NODE_ENV !== 'production';
const __dirname = path.resolve();

dotenv.config();
console.log('isDevelopment::', isDevelopment);

const config = {
  mode: isDevelopment ? 'development' : 'production',
  devtool: !isDevelopment ? 'hidden-source-map' : 'inline-source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@assets': path.resolve(__dirname, './src/assets/'),
      '@components': path.resolve(__dirname, './src/components/'),
      '@hooks': path.resolve(__dirname, './src/hooks/'),
      '@layouts': path.resolve(__dirname, './src/layouts/'),
      '@pages': path.resolve(__dirname, './src/pages/'),
      '@reducers': path.resolve(__dirname, './src/reducers/'),
      '@styles': path.resolve(__dirname, './src/styles/'),
      '@utils': path.resolve(__dirname, './src/utils/'),
    },
  },

  devServer: {
    historyApiFallback: true,
    open: true,
    static: { directory: path.resolve(__dirname) },
    devMiddleware: { publicPath: '/' },
    hot: true,
    port: 3000,
  },

  entry: {
    app: './src/client.tsx',
  },

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
    publicPath: '/',
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                [
                  '@babel/plugin-transform-runtime',
                  {
                    corejs: 3,
                    proposals: true,
                  },
                ],
                ['@emotion', { sourceMap: true }],
                ...(isDevelopment ? [['react-refresh/babel', { skipEnvCheck: true }]] : []),
              ],
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: {
                      browsers: ['> 1% in KR'],
                    },
                    debug: true,
                    modules: false,
                  },
                ],
                ['@babel/preset-react', { runtime: 'automatic' }],
                [
                  '@babel/preset-typescript',
                  {
                    isTSX: true,
                    allExtensions: true,
                  },
                ],
              ],
            },
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: path.join(__dirname, 'node_modules'),
      },
      {
        test: [/\.css$/, /\.s[ac]ss$/i],
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash:8].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'assets/images/[name].[hash:8].[ext]',
            },
          },
        ],
      },
      {
        test: [/\.png?$/, /\.gif?$/, /\.ico?$/, /\.jpeg?$/, /\.jpg?$/, /\.svg$/],
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[hash:8].[ext]',
          },
        },
      },
    ],
  },

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin({
      async: false,
      // eslint: {
      //   files: "./src/**/*",
      // },
    }),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: 'src/assets/fonts',
    //       to: 'src/assets/fonts',
    //     },
    //     {
    //       from: 'src/assets/images',
    //       to: 'src/assets/images',
    //     },
    //   ],
    // }),
    new webpack.LoaderOptionsPlugin({ debug: true }),
    new webpack.EnvironmentPlugin({ NODE_ENV: isDevelopment ? 'development' : 'production' }),
    new HtmlWebpackPlugin({
      title: 'Index',
      filename: 'index.html',
      showErrors: true,
      template: './index.html',
    }),
  ],
};

/* Development */
if (isDevelopment && config.plugins) {
  config.plugins?.push(new webpack.HotModuleReplacementPlugin());
  config.plugins?.push(new BundleAnalyzerPlugin({ analyzerMode: 'server', openAnalyzer: false }));
  config.plugins?.push(
    new ReactRefreshWebpackPlugin({
      overlay: {
        useURLPolyfill: true,
      },
    }),
  );
}

/* Production */
if (!isDevelopment && config.plugins) {
  config.plugins?.push(new webpack.LoaderOptionsPlugin({ minimize: true }));
  config.plugins?.push(new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: true }));
}

export default config;
