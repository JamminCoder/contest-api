const mongoose = require("mongoose");

const contenderSchema = mongoose.Schema({
    name: String,
    belongsToContestID: Number,
    points: Number,
    lastPoints: Number,
}
);


const Contender = mongoose.model("Contender", contenderSchema);
module.exports = { default: Contender };