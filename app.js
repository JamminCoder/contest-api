const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectToDb = require('./db').default;

const app = express();
const port = 8000;


connectToDb().catch(err => console.log(err));


// Import controllers
const AuthController = require('./controllers/AuthController').default;


app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.post('/register', AuthController.register);

app.post('/login', AuthController.login);


app.listen(port, () => {
    console.log(`API listening on port ${port}`);
});
