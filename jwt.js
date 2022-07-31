const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const generateJWT = username => {
    const expireTimeSeconds = 60 * 60 * 60 * 24 * 7; // 7 days
    return jwt.sign(
        { 
            username: username,
            dateCreated: Date.now()
        },
        process.env.TOKEN_SECRET, { expiresIn: `${ expireTimeSeconds }s` }
    )
};


module.exports = { generateJWT: generateJWT }