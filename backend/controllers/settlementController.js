const Settlement = require('../models/Settlement')
const { calculateBalances } = require('../controllers/expenseController')

async function recordSettlement(req, res) {
    try {
        const { groupId, to, amount } = req.body
        const from = req.userId
        
        let balances = await calculateBalances(groupId)
        const fromBalance = balances[from] || 0
        const toBalance = balances[to] || 0


        if (fromBalance >= 0) {
            return res.status(400).json({ error: "You don't owe any money in this group" });
        }
        if (amount > Math.abs(fromBalance)) {
            return res.status(400).json({ error: "Amount exceeds what you owe" });
        }
        if (toBalance <= 0 || amount > toBalance) {
            return res.status(400).json({ error: "This user is not owed that much" });
        }

        
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
        console.error(error.message)
        res.status(500).json({ error: "Something went wrong" })
    }
}

async function getPendingSettlements(req, res) {
    try {
        const { groupId } = req.params
        const settlements = await Settlement.find({ group: groupId, status: 'pending' })
            .populate('from', 'name')
            .populate('to', 'name')

        res.status(200).json(settlements)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: "Something went wrong" })
    }
}

module.exports = { recordSettlement , confirmSettlement , getPendingSettlements }