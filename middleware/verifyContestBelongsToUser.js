const jwtTools = require("../jwtTools");
const Contest = require("../models/Contest").default;


async function verifyContestBelongsToUser(req, res, next) {
    const username = await jwtTools.getUsernameFromRequest(req);
    const contestID = req.body.contestID;
    const contest = await Contest.findOne({ contestID: contestID })
    if (!contest) {
        res.send("Cannot find contest");
        return;
    }

    const contestManager = contest.contestManager;

    if (contestManager !== username ) {
        res.send("You are not allowed here." );
        return;
    }

    next();
}


module.exports = { default: verifyContestBelongsToUser };