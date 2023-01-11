const path = require("node:path");

exports.makePath = function(...names) {
    if (names[0].startsWith("/")) {
	return path.join(...names);
    } else {
	return path.join(__dirname, ...names);
    }
}

