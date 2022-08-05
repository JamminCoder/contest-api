const bcrypt = require('bcrypt');
const jwtTools = require('../jwtTools');

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
                const token = jwtTools.generateJWT(username);
    
                res.json({
                    ok: true,
                    jwt: token,
                    expires: jwtTools.expireTime
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
    
        // Check password strings for errors
        const passwordError = AuthController.checkForPasswordError(unhashedPassword, confPassword);
        if (passwordError) {
            res.send(passwordError);
            return;
        }
        
    
        // All's good! Hash the password and store the user in the DB
        bcrypt.hash(unhashedPassword, saltRounds, (err, hashedPassword) => {
            if (err) {
                res.send("Something went wrong. Please try again.");
                return;
            }

            const newUser = new User({ username: username, password: hashedPassword });
            newUser.save();
            const token = jwtTools.generateJWT(username);
            res.json({
                ok: true,
                jwt: token,
                expires: jwtTools.expireTime
            });
        });
    
        
    }

    static async getUser(req, res) {
        const username = await jwtTools.getUsernameFromRequest(req);
        res.send(username);
    }

    static checkForPasswordError(unhashedPassword, confPassword) {
        if (Buffer.byteLength(unhashedPassword) >= 255 || unhashedPassword.length > 32) {
            return "Password is too long! Super long passwords can lead to vulnerabilies.";
        }
    
        if (unhashedPassword.length < 8) {
            return "Password too short! Must be atleast 8 characters long!";
        }
    
        // Make sure password and password confirmation match
        if (!(unhashedPassword === confPassword)) {
            return "Passwords do not match!";
        }

        return null;
    }
};


module.exports = { 
    default: AuthController
};