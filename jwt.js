const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const days = 7;
const expireTimeSeconds = 60 * 60 * 60 * 24 * days; // 7 days
const generateJWT = username => {
    
    return jwt.sign(
        { 
            username: username,
            dateCreated: Date.now(),
        },
        process.env.TOKEN_SECRET, { expiresIn: `${ expireTimeSeconds }s` }
    )
};


module.exports = { generateJWT: generateJWT, jwtExpireTimeSeconds: expireTimeSeconds }