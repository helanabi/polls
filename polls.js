const httpError = require("http-errors");
const jwt = require("jsonwebtoken");
const db = require("./db.js");

function authorize(req, next) {
    const token = req.get("Authorization");
    if (!token) {
	next?.(httpError(401));
	return Promise.resolve(false);
    }

    return new Promise((resolve, reject) => {
	jwt.verify(token, process.env.JWT_KEY, (err, user) => {
	    if (err) {
		next?.(httpError(406, "invalid token"));
		resolve(false);
	    } else {
		req.user = user;
		resolve(true);
	    }
	});
    });
}

exports.getAll = async function(req, res, next) {
    let polls;
    let voteCounts;

    await authorize(req);

    try {
	polls = await db.polls(req.user);
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
    if (!await authorize(req, next)) return;

    try {
	await db.savePoll(req.user, req.body);
	res.status(201).end();
    } catch(err) {
	next(err);
    }
};

exports.vote = async function(req, res, next) {
    if (!await authorize(req, next)) return;
    const { pollId, choice } = req.body;

    try {
	await db.vote(req.user, pollId, choice);
	res.status(201).end();
    } catch(err) {
	next(err);
    }
};
