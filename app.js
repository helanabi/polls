const dotenv = require("dotenv");
const { makePath } = require("./utils.js");
dotenv.config({ path: makePath(".env") });

const express = require("express");
const db = require("./db.js");
const polls = require("./polls.js");
const users = require("./users.js");

const { PORT } = process.env;
const app = express();

app.use(express.json());
app.use(express.static(makePath("public")));

app.post("/api/signup", users.signup);
app.post("/api/login", users.login);

app.get("/api/polls", polls.getAll);
app.post("/api/polls", polls.post);

app.get("/*", (req, res) => {
    res.sendFile(makePath("public/index.html"));
});

app.use((err, req, res, next) => {
    console.error(err.toString());
    res.status(err.status ?? 500).send({ error: err.message });
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
