const jwtTools = require("../jwtTools");
const crypto = require("crypto");

const Contest = require('../models/Contest').default;


class ContestController {
    static async list(req, res) {
        const contests = await Contest.find();
        res.json({contests: contests});
    }

    static async show(req, res) {
        const contest = await Contest.findOne({ contestID: req.query.contestID });
        return res.json({contest: contest});
    }

    static async new(req, res) {
        const contestName = req.body.name;
        const pointType = req.body.pointType;

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


    static async newContender(req, res) {
        const contenderName = req.body.contender;
        const startingPoints = parseInt(req.body.points) || 0;
        const contestID = parseInt(req.body.contestID);

        const newContender = {
            contender: contenderName,
            points: startingPoints,
            contenderID: crypto.randomBytes(16).toString("hex")
        }

        const currentContenders = await Contest.distinct("contenders.contender");
        console.log(currentContenders);
        if (currentContenders.includes(contenderName)) {
            res.send("Contender already exists!");
            return;
        }
        
        await Contest.updateOne(
            { contestID: contestID }, 
            { $push: { contenders: newContender } }
        );

        res.json({
            ok: true,
            message: "Success"
        });
    }

    static async updatePoints(req, res) {
        const contenderName = req.body.contenderName;
        const contestID = req.body.contestID;
        const points = parseInt(req.body.points);
        const result = await Contest.findOne(
            {"contenders.contender": contenderName},
            { contestID: contestID, contenders: { $elemMatch: {contender: contenderName}} }
        );
        
        const lastPoints = result.contenders[0].points;
            
        await Contest.updateOne({contestID: 0, "contenders.contender": contenderName}, { $set: {"contenders.$.points": lastPoints + points }})


        res.send("OK");
    }
}


module.exports = { default: ContestController };