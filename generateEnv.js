const fs = require("fs");
const crypto = require("crypto");

const TOKEN_SECRET = crypto.randomBytes(64).toString('hex');
const PORT = 8000;

fs.writeFileSync(".env", `PORT=${PORT}\nTOKEN_SECRET=${TOKEN_SECRET}\n`);