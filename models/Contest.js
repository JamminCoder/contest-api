const mongoose = require("mongoose");

const contestSchema = mongoose.Schema({
    contestID: Number,
    contestManager: String,
    contestName: String
},
{
    statics: {
        async getNextID() {
            const result = await this.find().sort({ contestID: -1 });
            return result[0].contestID;
        }
    }

}
);


const Contest = mongoose.model("Contest", contestSchema);

module.exports = { default: Contest };