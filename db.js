const mongoose  = require('mongoose');

const dbConnectionString = 'mongodb://localhost:27017/point_tracker';

async function connectToDb() {
    await mongoose.connect(dbConnectionString);
}

module.exports = { default: connectToDb };