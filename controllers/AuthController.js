const bcrypt = require('bcrypt');
const generateJWT = require('../jwt').generateJWT;
const jwtExpireTime = require('../jwt').jwtExpireTimeSeconds;

const User = require('../models/User').User;

class AuthController {
    static async login(req, res) {
        const username = req.body.username;
        const password = req.body.password;
    
        const userExists = await User.countDocuments({ username: username }, { limit: 1 });
        if (userExists === 0) {
            res.send("User does not exist!");
            return;
        }
    
        const user = await User.findOne({ username: username });
        bcrypt.compare(password, user.password, (err, passwordIsOk) => {
            if (passwordIsOk) {
                const token = generateJWT(username);
    
                res.json({
                    ok: true,
                    jwt: token,
                    expires: jwtExpireTime
                });
    
                return;
            }
    
            res.send("Incorrect username or password!");
        });
    }
    
    static async register(req, res) {
        const saltRounds = 10;
        const username = req.body.username;
        const unhashedPassword = req.body.password;
        const confPassword = req.body.confPassword;
    
        // Make sure user doesn't already exist
        const userExists = await User.countDocuments({ username: username }, { limit: 1 });
        if (userExists != 0) {
            console.log(userExists);
            res.send("User already exists!");
            return;
        }
    
        // Ensure password string(s) are valid
        if (Buffer.byteLength(unhashedPassword) >= 255 || unhashedPassword.length > 32) {
            res.send("Password is too long! Super long passwords can lead to vulnerabilies.");
            return;
        }
    
        if (unhashedPassword.length < 8) {
            res.send("Password too short! Must be atleast 8 characters long!");
            return;
        }
    
        // Make sure password and password confirmation match
        if (!(unhashedPassword === confPassword)) {
            res.send("Passwords do not match!");
            return;
        }
    
        // All's good! Hash the password and store the user in the DB
        bcrypt.hash(unhashedPassword, saltRounds, (err, hashedPassword) => {
            const newUser = new User({ username: username, password: hashedPassword });
            newUser.save();
            const token = generateJWT(username);
            res.json({
                ok: true,
                jwt: token,
                expires: jwtExpireTime
            });
        });
    
        
    }
};


module.exports = { 
    default: AuthController
};