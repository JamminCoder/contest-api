const Contender = require("../models/Contender").default;

class ContenderController {
    static async getContendersFromContest(req, res) {
        const contestID = req.params.contestID;
        const contenders = await Contender.find({ belongsToContestID: contestID }).sort({points: -1});
        res.json({
            contenders: contenders
        });
    }

    static async updatePoints(req, res) {
        const contenderName = req.body.contenderName;
        const contestID = req.body.contestID;
        const points = parseInt(req.body.points);

        const contender = await Contender.findOne({ belongsToContestID: contestID, name: contenderName },);
        contender.points += points;
        contender.save();
    }

    static async newContender(req, res) {
        const contenderName = req.body.contender;
        const startingPoints = parseInt(req.body.points) || 0;
        const contestID = parseInt(req.params.contestID);

        const contender = new Contender({
            name: contenderName,
            belongsToContestID: contestID,
            points: startingPoints
        });

        const contenders = await Contender.find({ belongsToContestID: contestID });
        const currentContenders = contenders.map(c => { return c.name });

        if ( currentContenders.includes(contenderName)) {
            res.send("Contender already exists!");
            return;
        }

        contender.save();

        res.json({
            ok: true,
            message: "Success"
        });
    }

    static async deleteContender(req, res) {
        const contestID = req.params.contestID;
        const contenderName = req.params.contenderName;

        await Contender.deleteOne({ belongsToContestID: contestID, name: contenderName })
        res.send("Deleted contender");
    }
}

module.exports = { default: ContenderController };