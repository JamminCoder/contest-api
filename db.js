const mongoose  = require('mongoose');

const DB_NAME = "point_tracker";
const DB_PORT = 27017;
const DB_HOST = "localhost";


const dbConnectionString = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

async function connectToDb() {
    await mongoose.connect(dbConnectionString);
}

module.exports = { default: connectToDb };