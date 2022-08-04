const jwtTools = require("../jwtTools");

const Contest = require('../models/Contest').default;


class ContestController {
    static async list(req, res) {
        const contests = await Contest.find();
        res.json({contests: contests});
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


        console.log(`Name: ${ contestName }`)
        console.log(`Manager: ${ contestManager }`)
        console.log(`ID: ${ contestID }`)
        console.log(`Point Type: ${ pointType }`)
        
        const contest = new Contest({ 
            contestID: contestID,
            contestManager: contestManager,
            contestName: contestName,
            pointType: pointType,
        });

        contest.save();

        res.json({
            ok: true,
            message: "Successfully created contest",
        });
    }
}


module.exports = { default: ContestController };