const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const days = 7;
const expireTime = 60 * 60 * 60 * 24 * days; // 7 days
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const generateJWT = username => {
    
    return jwt.sign(
        { 
            username: username,
            dateCreated: Date.now(),
        },
        TOKEN_SECRET, { expiresIn: `${ expireTime }s` }
    )
};

async function getJWTFromRequest(req) {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        return null;
    }

    const values = authHeader.split(" ");
    if (values.length != 2) return null; // Invalid value 

    const token = values[1].trim();

    return token;
}

async function getUsernameFromRequest(req) {
    const token = await getJWTFromRequest(req);
    try {
        const decodedToken = await jwt.verify(token, TOKEN_SECRET);
        return decodedToken.username;

    } catch (err) {
        return null;
    }
    
}

module.exports = { 
    generateJWT: generateJWT,
    getJWTFromRequest: getJWTFromRequest,
    getUsernameFromRequest: getUsernameFromRequest,
    expireTime: expireTime
}