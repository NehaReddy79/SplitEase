const  Settlement  = require('../models/Settlement')

async function recordSettlement(req, res) {
    try {
        const { groupId, to, amount } = req.body
        const  from  = req.userId

        const newSettlement = new Settlement({ group: groupId, from, to, amount })
        await newSettlement.save()
        res.status(201).json(newSettlement)

    }catch(error){

        console.error(error.message)
        res.status(500).json({error : "Something went wrong"})
    }
    
    
}

module.exports = { recordSettlement }