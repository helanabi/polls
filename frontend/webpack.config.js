const path = require("node:path");
const HtmlPlugin = require("html-webpack-plugin");

const MODE = "development";

const options = {
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

if (MODE === "development") {
    options.mode = "development";
    options.devtool = "inline-source-map",

    options.devServer = {
	hot: false,
	historyApiFallback: true,
	proxy: {
	    "/api": "http://localhost:3000"
	}
    };
} else {
    options.mode = "production";

    options.module.rules.push({
	test: /\.js$/,
	use: {
	    loader: "babel-loader",
	    options: {
		presets: ["@babel/preset-env"],
	    }
	}
    });
}

module.exports = options;
