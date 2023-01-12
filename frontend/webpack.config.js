const path = require("node:path");
const HtmlPlugin = require("html-webpack-plugin");

const devOptions = {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
	hot: false,
	historyApiFallback: true,
	proxy: {
	    "/api": "http://localhost:3000"
	}
    }
};

const prodOptins = {
    mode: "production"
};

module.exports = {
    ...devOptions,
    
    entry: "./src/index.js",
    plugins: [
	new HtmlPlugin({
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
