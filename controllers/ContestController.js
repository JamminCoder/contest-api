const jwtTools = require("../jwtTools");

const Contest = require('../models/Contest').default;


class ContestController {
    static async list(req, res) {
        res.send("List Contest");
    }

    static async new(req, res) {
        const contestName = req.body.name;
        const contestManager = await jwtTools.getUsernameFromRequest(req);
        const contestID = await Contest.getNextID();


        console.log(`Name: ${ contestName }`)
        console.log(`Manager: ${ contestManager }`)
        console.log(`ID: ${ contestID }`)
        res.send("All good so far!");
    }
}


module.exports = { default: ContestController };