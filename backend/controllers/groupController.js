const Group = require('../models/Group')

async function createGroup(req, res) {
    try {
        const {name} = req.body

        const groupRes = new Group({ name, createdBy: req.userId, members: [req.userId] })

        await groupRes.save();
        res.status(201).json({ message: "Group created successfully" })
    }
    catch(error){
        console.error(error.message)
        res.status(500).json({error : "Something went wrong"})
    }

}
module.exports = createGroup;