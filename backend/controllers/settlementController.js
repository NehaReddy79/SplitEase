const Settlement = require('../models/Settlement')

async function recordSettlement(req, res) {
    try {
        const { groupId, to, amount } = req.body
        const from = req.userId

        const newSettlement = new Settlement({ group: groupId, from, to, amount })
        await newSettlement.save()
        const io = req.app.get('io')
        io.to(groupId).emit('settlementRecorded', newSettlement)
        res.status(201).json(newSettlement)

    } catch (error) {

        console.error(error.message)
        res.status(500).json({ error: "Something went wrong" })
    }


}

async function confirmSettlement(req, res) {
    try {
        const { settlementId } = req.params
        const settlement = await Settlement.findById(settlementId)

        if (!settlement) {
            return res.status(404).json({ error: "Settlement not found" })
        }

        if (req.userId !== settlement.to.toString()) {
            return res.status(403).json({ error: "Only the recipient can confirm this payment" })

        }

        settlement.status = 'confirmed'
        await settlement.save()

        const io = req.app.get('io')
        io.to(settlement.group.toString()).emit('settlementConfirmed', settlement)

        res.status(200).json(settlement)
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Something went wrong" });
    }
}

module.exports = { recordSettlement , confirmSettlement }