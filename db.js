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
}

exports.close = function() {
    return client.end();
}


exports.polls = async function() {
    return (await client.query("SELECT * FROM Polls")).rows;
}

exports.votesPerPoll = async function() {
    return (await client.query("SELECT * FROM Votes_per_poll")).rows;
}