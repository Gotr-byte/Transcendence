module.exports = {
	entry: './src/ATeam_Pong.ts',
	output: {
	  filename: 'bundle.js',
	  path: __dirname + '/dist'
	},
	resolve: {
	  extensions: ['.ts', '.js']
	},
	module: {
	  rules: [
		{
		  test: /\.ts$/,
		  use: 'ts-loader',
		  exclude: /node_modules/
		}
	  ]
	}
  };
  