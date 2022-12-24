const dotenv = require("dotenv");
const { makePath } = require("./utils.js");
dotenv.config({ path: makePath(".env") });

const express = require("express");
const db = require("./db.js");

const { PORT } = process.env;
const app = express();

app.use(express.static(makePath("public")));

app.get("/api/polls", async (req, res, next) => {
    let polls;
    let votes;

    try {
	polls = await db.polls();
	votes = await db.votesPerPoll();
    } catch (err) {
	next(err);
    }
    
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
});

async function main() {
    await db.init();

    app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}...`);
    });
}

process.on("SIGTERM", async () => {
    await db.close();
    process.exit();
});

main();
