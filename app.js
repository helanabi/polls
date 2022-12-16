const dotenv = require("dotenv");
const express = require("express");
const { makePath } = require("./utils.js");

dotenv.config({ path: makePath(".env") });
const { PORT } = process.env;
const app = express();

app.use(express.static(makePath("public")));

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
