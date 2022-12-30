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

exports.polls = async function(user) {
    let columns = "Polls.id, username AS creator, title, creation_time";
    let fromItem = "Polls JOIN Users ON Polls.creator = Users.id";
    const params = [];

    if (user) {
	columns += ", choice";
	fromItem = `(${fromItem}) LEFT JOIN Votes ` +
	    "ON Polls.id = Votes.poll AND voter = $1";
	params.push(user.id);
    }
    
    return (await client.query(
	`SELECT ${columns} FROM ${fromItem} ORDER BY creation_time DESC`,
	params)).rows;
};

exports.voteCounts = async function() {
    return (await client.query("SELECT * FROM Vote_counts")).rows;
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

exports.vote = function(user, pollId, choice) {
    return client.query("INSERT INTO Votes VALUES ($1, $2, $3)",
			[ user.id, pollId, choice ]);
}

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
