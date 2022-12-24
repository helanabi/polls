const bcrypt = require("bcrypt");
const httpError = require("http-errors");
const db = require("./db.js");

exports.signup = function(req, res, next) {
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
	if (err) return next(err);
	
	try {
	    await db.saveUser({ ...req.body, pwd_hash: hash });
	    res.end();
	} catch(err) {
	    if (err.message.includes("violates unique constraint")) {
		for (const field of ["username", "email"]) {
		    if (err.message.includes(field))
			return next(httpError(406, `${field} already used`));
		}
	    }
	    next(err);
	}
    });
};
