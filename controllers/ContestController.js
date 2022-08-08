const Contender = require("../models/Contender").default;
const jwtTools = require("../jwtTools");
const Contest = require('../models/Contest').default;


class ContestController {
    static async list(req, res) {
        const contests = await Contest.find();
        res.json({contests: contests});
    }

    static async show(req, res) {
        const contestID = req.params.contestID;
        const contest = await Contest.findOne({ contestID: contestID });
        return res.json({contest: contest});
    }

    static async new(req, res) {
        const contestName = req.body.name;
        let pointType = req.body.pointType;

        if (!contestName) {
            res.send("Contest name required!");
            return;
        }

        if (!pointType) pointType = "Points";


        const contestManager = await jwtTools.getUsernameFromRequest(req);
        const contestID = await Contest.getNextID();
        
        const contest = new Contest({ 
            contestID: contestID,
            contestManager: contestManager,
            contestName: contestName,
            pointType: pointType,
            contenders: []
        });

        contest.save();

        res.json({
            ok: true,
            message: "Successfully created contest",
        });
    }

    static async delete(req, res) {
        const contestID = req.params.contestID;

        try {
            await Contest.deleteOne({ contestID: contestID });
            await Contender.deleteMany({ belongsToContestID: contestID });
            res.send("OK");
        } catch (err) {
            console.log(err);
            res.send("Something when wrong");
        }
    }
}


module.exports = { default: ContestController };