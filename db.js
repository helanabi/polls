const { Client } = require("pg");
const client = new Client();

exports.init = async function() {
    await client.connect();
    console.log("Database connection established.");

    const {rows: tableNames} = await client.query(
	"SELECT tablename FROM pg_tables WHERE schemaname = 'public'");

    const tables = tableNames
	  .map(row => row.tablename)
	  .sort()
	  .join();

    if (tables !== "choices,polls,users,votes") {
	await client.end();
	throw new Error("Wrong database schema");
    }
};

exports.close = function() {
    return client.end();
};


exports.polls = async function() {
    return (await client.query("SELECT * FROM Polls")).rows;
};

exports.votesPerPoll = async function() {
    return (await client.query("SELECT * FROM Votes_per_poll")).rows;
};

exports.savePoll = async function(creator, poll) {
    const pollRes = await client.query(
	"INSERT INTO Polls (creator, title, creation_time) " +
	    "VALUES ($1, $2, 'now') RETURNING *",
	[creator.id, poll.title]);

    const pollId = pollRes.rows[0].id;

    for (const choice of poll.choices) {
	await client.query(
	    `INSERT INTO Choices VALUES ($1, ${pollId})`,
	    [choice]);
    }
    
    return pollId;
};

exports.saveUser = function(user) {
    return client.query(
	"INSERT INTO Users (username, email, pwd_hash) " +
	    "VALUES ($1, $2, $3)",
	[user.username, user.email, user.pwd_hash]);
};

exports.user = async function(username) {
    const res = await client.query(
	"SELECT * FROM Users WHERE username = $1",
	[username]);
    
    if (res.rows.length)
	return res.rows[0];
};
