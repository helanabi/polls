const bcrypt = require("bcrypt");
const httpError = require("http-errors");
const jwt = require("jsonwebtoken");
const db = require("./db.js");
const mailer = require("./mailer.js");

function makeToken(payload) {
    return new Promise((resolve, reject) => {
	jwt.sign(payload, process.env.JWT_KEY, (err, token) => {
	    if (err) reject(err);
	    else resolve(token);
	});
    });
}
// TODO: generalize this
function decode(token) {
    return new Promise((resolve, reject) => {
	jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
	    if (err) reject(err);
	    else resolve(decoded);
	});
    });
}
// TODO: generalize this
function checkPassword(password, hash) {
    return new Promise((resolve, reject) => {
	bcrypt.compare(password, hash, (err, result) => {
	    if (err) reject(err);
	    else if (!result) reject(httpError(406, "wrong password"));
	    else resolve();
	});
    });
}

exports.auth = function(req, res, next) {
    jwt.verify(req.body.token, process.env.JWT_KEY, (err, decoded) => {
	if (err) return next(err);
	res.end();
    });
}

exports.signup = function(req, res, next) {
    const { username, email, password } = req.body;
    
    bcrypt.hash(password, 10, async (err, hash) => {
	if (err) return next(err);
	
	try {
	    await db.saveUser({ username, email, pwd_hash: hash });

	    await mailer.verify({
		username,
		email,
		token: await makeToken({ email })
	    });

	    res.status(201).end();
	} catch(err) {
	    next(err);
	}
    });
};

exports.login = async function(req, res, next) {
    const user = await db.user(req.body.username);
    if (!user) return next(httpError(406, "username not found"));
    if (!user.verified) return next(httpError(401, "unconfirmed account"));

    try {
	await checkPassword(req.body.password, user.pwd_hash);
	const token = await makeToken({ id: user.id });
	res.send({ token });
    } catch(err) {
	next(err);
    }
};

exports.verify = async function(req, res, next) {
    const { token, password } = req.body;

    try {
	const { email } = await decode(token);
	const user = await db.user(email, "email");
	await checkPassword(password, user.pwd_hash);
	await db.verify(user.id);
	res.end();
    } catch(err) {
	return next(err);
    }
}
