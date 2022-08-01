const express = require('express');
const mongoose  = require('mongoose');
const User = require('./models/User').User;
const bcrypt = require('bcrypt');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const generateJWT = require('./jwt').generateJWT;
const jwtExpireTime = require('./jwt').jwtExpireTimeSeconds;
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const app = express();
const port = 8000;
const dbConnectionString = 'mongodb://localhost:27017/point_tracker';

connectToDb().catch(err => console.log(err));

async function connectToDb() {
    await mongoose.connect(dbConnectionString);
}


app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.post('/register', async (req, res) => {
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

    
});

app.post('/login', async (req, res) => {
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

});


app.get('/test_jwt', (req, res) => {
    const token = req.cookies.jwt;

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {

        if (err) {
            res.send("You are not allowed here!!");
            return;
        }

        res.send(`Your JWT is ${token}. <br> Your username is ${ decodedToken.username }`);
    });

    
});

app.listen(port, () => {
    console.log(`API listening on port ${port}`);
});
