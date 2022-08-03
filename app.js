const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectToDb = require('./db').default;


dotenv.config();
const app = express();
const port = process.env.PORT;


// Connect to database
connectToDb().catch(err => console.log(err));


// Register middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


// Import controllers
const AuthController = require('./controllers/AuthController').default;



// Routes
app.post('/register', AuthController.register);
app.post('/login', AuthController.login);




app.listen(port, () => {
    console.log(`API listening on port ${port}`);
});
