const mongoose = require("mongoose");

const contestSchema = mongoose.Schema({
    contestID: Number,
    contestManager: String,
    contestName: String,
    pointType: String,
    contenders: Array
},
{
    statics: {
        async getNextID() {
            const result = await this.find().sort({ contestID: -1 });
            if (result.length >= 1) return result[0].contestID + 1;

            return 0;
        }
    }

}
);


const Contest = mongoose.model("Contest", contestSchema);
module.exports = { default: Contest };