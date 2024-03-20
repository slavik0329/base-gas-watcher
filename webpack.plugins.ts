import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const assets = [ "assets" ]; // asset directories

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const copyPlugins = assets.map((asset) => {
  return new CopyWebpackPlugin({
    patterns: [{ from: path.resolve(__dirname, 'src', asset), to: asset }],
  });
});

export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: 'webpack-infrastructure',
  }),
  ...copyPlugins
];
