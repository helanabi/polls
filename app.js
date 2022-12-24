const dotenv = require("dotenv");
const express = require("express");
const { Client: PgClient } = require("pg");
const { makePath } = require("./utils.js");

dotenv.config({ path: makePath(".env") });
const { PORT } = process.env;
const app = express();
const pg = new PgClient();

app.use(express.static(makePath("public")));

app.get("/api/polls", async (req, res, next) => {
    try {
	const {rows: polls} = await pg.query("SELECT * FROM Polls")
	const {rows: votes} = await pg.query("SELECT * FROM Votes_per_poll");
	
	const pollsWithVotes = polls.map(poll => {
	    const choices = votes
		  .filter(count => count.poll === poll.id)
		  .map(count => {
		      return {
			  description: count.choice,
			  votes: count.votes
		      };
		  });
	    
	    return { ...poll, choices };
	});

	return res.json(pollsWithVotes);
    } catch (err) {
	next(err);
    }
});

function shutdown() {
    pg.end();
    process.exit();
}

pg.connect()
    .then(() => {
	console.log("Database connection established.");
	return pg.query("SELECT tablename FROM pg_tables " +
			"WHERE schemaname = 'public'");
    })
    .then(({rows}) => {
	const tables = rows.map(row => row.tablename)
	      .sort()
	      .join();

	if (tables !== "choices,polls,users,votes") {
	    throw new Error("Wrong database schema");
	}

	app.listen(PORT, () => {
	    console.log(`Server listening on port ${PORT}...`);
	});
    })
    .catch(err => {
	console.error(err.toString());
	shutdown();
    });


process.on("SIGTERM", shutdown);
