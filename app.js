const express = require('express');
const mongoose  = require('mongoose');
const Cat = require('./models/Cat').Cat;

const app = express();
const port = 8000;
const dbConnectionString = 'mongodb://localhost:27017/point_tracker';

// connectToDb().catch(err => console.log(err));

async function connectToDb() {
    await mongoose.connect(dbConnectionString);
}


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    console.log(`Username is "${username}"`);
    res.send(username);
});


// app.get('/db_test', async (req, res) => {
//     const newCat = new Cat({ name: "Mr. Smith", age: 64 });
//     console.log(`The name of the cat is ${ newCat.name }`);

//     await newCat.save();

//     console.log(`${ newCat.name } has been saved.`);
//     res.send(`Created new cat ${ newCat.name }`);
// });


app.listen(port, () => {
    console.log(`API listening on port ${port}`);
});
