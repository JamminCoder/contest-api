const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectToDb = require('./db').default;
const verifyAuthHeader = require("./middleware/verifyAuthHeader").default;
const verifyContestBelongsToUser = require("./middleware/verifyContestBelongsToUser").default;


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
const ContenderController = require("./controllers/ContenderController").default;

// Routes
app.post('/register', AuthController.register);
app.post('/login', AuthController.login);

app.post('/contests/new', verifyAuthHeader, ContestController.new);
app.get("/contests/list", ContestController.list);
app.get("/contests/:contestID/show", ContestController.show);

app.post("/contests/:contestID/new_contender", 
    verifyAuthHeader,
    verifyContestBelongsToUser, 
    ContenderController.newContender
);

app.post("/contests/update_points",
    verifyAuthHeader,
    verifyContestBelongsToUser,
    ContenderController.updatePoints
);

app.get("/contests/:contestID/contenders", ContenderController.getContendersFromContest);
app.get("/user", AuthController.getUser);


app.listen(port, () => {
    console.log(`API listening on port ${port}`);
});
