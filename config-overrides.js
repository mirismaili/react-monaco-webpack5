const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const DynamicCdnWebpackPlugin = require('dynamic-cdn-webpack-plugin')
const fs = require('fs')

module.exports = function override (config, env) {
	config.entry = {
		'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
		'yaml.worker': 'monaco-yaml/lib/esm/yaml.worker.js',
		main: './src/index.js',
	}
	config.optimization.runtimeChunk = 'single'
	// // // delete config.optimization
	// // delete config.node
	// // delete config.performance
	// // // delete config.mode
	// // delete config.bail
	// // delete config.devtool
	// // delete config.resolveLoader
	//
	// config.externals =  {jquery: 'jQuery'}
	// // config.plugins.push(
	// // 		new DynamicCdnWebpackPlugin({only: 'ansi-colors-and-styles'})
	// // )
	//
	// console.log(config)
	// fs.writeFileSync('webpack-config.json', JSON.stringify(config, null, '\t'))
	
	return config
}
