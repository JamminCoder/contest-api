const jwt = require('jsonwebtoken');

const verifyAuthHeader = (req, res, next) => {
    const authHeader = req.header("Authorization");

    try {
        if (!authHeader) {
            res.send("You are not allowed here.")
            console.log("Token is not verified.");
            return;
        }
    
        const token = authHeader.trim().split(" ")[1].trim();
    
        jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
            if (err) {
                res.send("You are not allowed here.");
                console.log("Token is not verified.");
                return;
            }
            
            console.log("Token verified.");
            next();
        });
    } catch (err) {
        console.log("ERROR: " + err);
        res.send("Something went wrong!");
    }
    
}

module.exports = { verifyAuthHeader: verifyAuthHeader };