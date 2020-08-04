const path = require('path')
const nodeExternals = require('webpack-node-externals')

const config = {
	// target environment
	target: 'node',
	// To use relative path on entry
	context: path.resolve(__dirname, 'src'),
	// SPA: single entry, MPA: multiple entries
	entry: './index.js',
	// enable default plugins for the environment
	mode: process.env.WEBPACK_ENV,
	// generate source map for debugging
	devtool: 'source-map',
	// translate es6 with babel
	module: {
		rules: [
			{
				test: /\.(js)$/,
				exclude: /node_modules/,
				use: ['babel-loader']
			},
			// {
			// 	enforce: 'pre',
			// 	test: /\.js$/,
			// 	loader: 'eslint-loader',
			// 	exclude: /(node_modules)/
			// }
		]
	},
	// excluding nodejs dependencies from the output
	externals: [
		nodeExternals()
	],
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	}
}

module.exports = config
