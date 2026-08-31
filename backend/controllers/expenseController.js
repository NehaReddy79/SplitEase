const Expense = require('../models/Expense')

async function addExpense(req, res) {
    try {
        const { groupId, amount, description, splitType, participants } = req.body
        let splits = []
        if (splitType === "equal") {

            const splitAmt = amount / participants.length
            splits = participants.map((participantId) => {
                return { user: participantId, amount: splitAmt }
            })

        }
        else if(splitType === "exact"){
            let sum = 0

            for(const participant of participants){
                sum += participant.amount
            }

            if( Math.abs(sum - amount) > 0.01){
                return res.status(400).json({error : "Invalid amount"})
            }

            splits = participants.map((p) => {
                return {user : p.userId , amount : p.amount}
            })

        }
        else if(splitType === "percentage"){
            let sum = 0

            for(const participant of participants){
                sum += participant.percentage
            }

            if(Math.abs(sum - 100) > 0.01){
                return res.status(400).json({error : "The percentages don't add up to 100"})
            }

            splits = participants.map((p) =>{
                return {user : p.userId , amount : (p.percentage / 100) * amount}
            })

        }
        else {
            return res.status(500).json({ error: "Invalid split type" })
        }

        const expenseRes = new Expense({ group: groupId, paidBy: req.userId, amount, description, splitType, splits })

        await expenseRes.save()
        res.status(201).json({ message: "Expenses created" })

    }
    catch (error) {
        console.error(error.message)
        res.status(500).json({ error: "Something went wrong" })
    }
}

async function getExpenses(req, res) {
    try {
        const { groupId } = req.params

        const expenseRes = await Expense.find({ group: groupId }).populate("paidBy", "name email")

        res.status(200).json(expenseRes)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: "Something went wrong" })
    }
}

async function getBalances(req, res) {
    try {
        const { groupId } = req.params;

        const expenses = await Expense.find({ group: groupId })

        let balances = {}

        for (const expense of expenses) {
            const paidBy = expense.paidBy.toString()
            balances[paidBy] = (balances[paidBy] || 0) + expense.amount

            for (const split of expense.splits) {
                const user = split.user.toString()

                balances[user] = (balances[user] || 0) - split.amount
            }
        }
        res.json(balances)

    }catch(error){
        console.error(error.message)
        res.status(500).json({error : "Something went wrong"})
    }
    
}

function simplifyDebts(balances){
    const creditors = []
    const debtors = []
    const settlements = []

    for( const [user , balance] of Object.entries(balances)){
        if(balance > 0){
            creditors.push({user , amount : balance})
        }else if(balance < 0){
            debtors.push({user , amount : -balance})
        }
    }

    creditors.sort((a , b) => b.amount - a.amount)
    debtors.sort((a,b) => b.amount - a.amount)

    let i = 0 , j = 0

    while(i < creditors.length && j < debtors.length){
        const settlement = Math.min(creditors[i].amount , debtors[j].amount)
        settlements.push({from: debtors[j].user , to: creditors[i].user , amount: settlement});
        creditors[i].amount -= settlement
        debtors[j].amount -= settlement
        if (creditors[i].amount === 0 ) i++
        if (debtors[j].amount === 0) j++
    }

    return settlements

}

async function getSettlements(req, res){
    try{
        const { groupId } = req.params
        const expenses = await Expense.find({ group : groupId});

        let balances = {}

        for (const expense of expenses) {
            const paidBy = expense.paidBy.toString()
            balances[paidBy] = (balances[paidBy] || 0) + expense.amount

            for (const split of expense.splits) {
                const user = split.user.toString()

                balances[user] = (balances[user] || 0) - split.amount
            }
        }
        const settlements = simplifyDebts(balances)

        res.json(settlements)

    }catch(error){
        console.error(error.message)
        res.status(500).json({error : "Something went wrong"})
    }
}

module.exports = { addExpense, getExpenses, getBalances , getSettlements }