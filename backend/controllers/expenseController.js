const Expense = require('../models/Expense')

async function addExpense(req, res) {
    try {
        const { groupId, amount, description, splitType, participants } = req.body
        let splits = []
        if (splitType === "equal") {

            const splitAmt = amount / participants.length
            splits = participants.map((participantId) => {
                return { user : participantId , amount : splitAmt}
            })

        }
        else{
            return res.status(400).json({ error: "Only equal split supported for now" })
        }

        const expenseRes = new Expense({group : groupId , paidBy : req.userId , amount , description , splitType , splits})

        await expenseRes.save()
        res.status(201).json({message : "Expenses created"})

    }
    catch(error){
        console.error(error.message)
        res.status(500).json({error : "Something went wrong"})
    }
}

module.exports = addExpense