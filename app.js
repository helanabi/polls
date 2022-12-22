const dotenv = require("dotenv");
const express = require("express");
const { Client: PgClient } = require("pg");
const { makePath } = require("./utils.js");

dotenv.config({ path: makePath(".env") });
const { PORT } = process.env;
const app = express();
const pg = new PgClient();

app.use(express.static(makePath("public")));

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
