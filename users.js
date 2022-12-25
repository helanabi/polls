const bcrypt = require("bcrypt");
const httpError = require("http-errors");
const jwt = require("jsonwebtoken");
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

exports.login = async function(req, res, next) {
    const user = await db.user(req.body.username);

    if (!user)
	return next(httpError(406, "username not found"))

    bcrypt.compare(req.body.password, user.pwd_hash, (err, result) => {
	if (err) return next(err);
	if (!result) return next(httpError(406, "wrong password"));

	jwt.sign({ id: user.id }, process.env.JWT_KEY, (err, token) => {
	    if (err) return next(err);
	    res.json({ token });
	});
    });
};
