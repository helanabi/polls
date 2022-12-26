const httpError = require("http-errors");
const jwt = require("jsonwebtoken");
const db = require("./db.js");

function authorize(req, next) {
    const token = req.get("Authorization");
    if (!token) return next(httpError(401));

    return new Promise((resolve, reject) => {
	jwt.verify(token, process.env.JWT_KEY, (err, user) => {
	    if (err) {
		next(httpError(406, "invalid token"));
		resolve();
	    } else {
		resolve(user);
	    }
	});
    });
}

exports.getAll = async function(req, res, next) {
    let polls;
    let voteCounts;

    try {
	polls = await db.polls();
	voteCounts = await db.voteCounts();
    } catch (err) {
	next(err);
    }

    const pollsWithVotes = polls.map(poll => {
	const choices = voteCounts
	      .filter(count => count.poll === poll.id)
	      .map(count => {
		  return {
		      description: count.description,
		      votes: count.votes
		  };
	      });
	
	return { ...poll, choices };
    });

    return res.json(pollsWithVotes);
}

exports.post = async function(req, res, next) {
    const user = await authorize(req, next);
    if (!user) return;

    try {
	await db.savePoll(user, req.body);
	res.status(201).end();
    } catch(err) {
	next(err);
    }
};
