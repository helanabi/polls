const path = require("node:path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    plugins: [
	new HtmlWebpackPlugin({
	    title: "Polls"
	})
    ],
    output: {
	filename: "bundle.js",
	path: path.resolve(__dirname, "dist"),
	clean: true
    },
    module: {
	rules: [
	    {
		test: /\.css$/,
		use: ["style-loader", "css-loader"]
	    },
	    {
		test: /\.ttf$/,
		type: "asset/resource"
	    },
	    {
		test: /\.svg$/,
		type: "json",
		parser: {
		    parse: x => x
		}
	    }
	]
    }
};
