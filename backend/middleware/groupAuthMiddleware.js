const Group = require('../models/Group')

async function verifyUser(req, res, next) {
    try {
        const groupId = req.params.groupId || req.body.groupId
        const userId = req.userId
        const groupRes = await Group.findById(groupId)

        if (!groupRes) {
            return res.status(404).json({ error: "Group doesn't exist" })
        }
        if (!groupRes.members.some(memberId => memberId.toString() === userId)) {
            return res.status(403).json({ error: "Only group memeber can make changes" })
        }
        req.group = groupRes
        next()
    }catch(error){
        console.error(error.message)
        res.status(500).json({error : "Something went wrong"})
    }
    
}

module.exports =  verifyUser 

