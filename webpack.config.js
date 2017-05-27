const webpack = require('webpack');

module.exports = opts => {
  opts = Object.assign({
    env: 'dev'
  }, opts);

  return {
    context: `${__dirname}/reporter`,
    entry: './client/viewer',
    output: {
      path: `${__dirname}/reporter/public`,
      filename: 'viewer.js',
      publicPath: '/'
    },

    resolve: {
      modules: [
        `${__dirname}/reporter/client/vendor`,
        'node_modules'
      ],
      extensions: ['.js', '.jsx']
    },

    devtool: (opts.env === 'dev') ? 'eval' : 'source-map',
    watch: (opts.env === 'dev'),

    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules|client\/vendor)/,
          loader: 'babel-loader',
          options: {
            presets: [
              ['env', { targets: { uglify: true } }]
            ],
            plugins: [
              'transform-class-properties',
              'transform-react-jsx',
              ['transform-object-rest-spread', { useBuiltIns: true }]
            ]
          }
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true,
                minimize: (opts.env === 'prod'),
                localIdentName: '[name]__[local]'
              }
            }
          ]
        },
        {
          test: /carrotsearch\.foamtree/,
          loader: 'exports-loader?CarrotSearchFoamTree'
        }
      ]
    },

    plugins: (plugins => {
      if (opts.env === 'dev') {
        plugins.push(
          new webpack.NamedModulesPlugin()
        );
      }

      if (opts.env === 'prod') {
        plugins.push(
          new webpack.DefinePlugin({
            'process.env': {
              NODE_ENV: '"production"'
            }
          }),
          new webpack.optimize.OccurrenceOrderPlugin(),
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              warnings: false,
              negate_iife: false
            },
            mangle: true,
            comments: false,
            sourceMap: true
          })
        );
      }

      return plugins;
    })([])
  };
};
