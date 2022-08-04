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
const ContestController = require('./controllers/ContestController').default;


// Routes
app.post('/register', AuthController.register);
app.post('/login', AuthController.login);

app.post('/contests/new', ContestController.new);
app.get("/contests/list", ContestController.list);
app.get("/contests/show", ContestController.show);
app.post("/contests/new_contender", ContestController.newContender);



app.listen(port, () => {
    console.log(`API listening on port ${port}`);
});
