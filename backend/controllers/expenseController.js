const Expense = require('../models/Expense')
const Settlement = require('../models/Settlement')

async function addExpense(req, res) {
    try {
        const { groupId, amount, description, splitType, participants, category } = req.body
        let splits

        try {
            splits = calculateSplits(splitType, amount, participants)
        } catch (err) {
            return res.status(400).json({ error: err.message })
        }


        const expenseRes = new Expense({ group: groupId, paidBy: req.userId, amount, description, splitType, splits, category })

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

        const {category , paidBy , from , to} = req.query

        let filter = { group : groupId}

        if(category){
            filter.category = category
        }
        if(paidBy){
            filter.paidBy = paidBy
        }
        if(from || to){
            filter.date = {}
            if( from ) { filter.date.$gte = new Date(from) }
            if( to ) {filter.date.$lte = new Date(to)}
        }

        const expenseRes = await Expense.find(filter).populate("paidBy", "name email")

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


        const settlements = await Settlement.find({ group: groupId })
        for (const settlement of settlements) {
            const from = settlement.from.toString()
            const to = settlement.to.toString()

            balances[from] = (balances[from] || 0) + settlement.amount
            balances[to] = (balances[to] || 0) - settlement.amount
        }

        res.json(balances)

    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: "Something went wrong" })
    }

}

function simplifyDebts(balances) {
    const creditors = []
    const debtors = []
    const settlements = []

    for (const [user, balance] of Object.entries(balances)) {
        if (balance > 0) {
            creditors.push({ user, amount: balance })
        } else if (balance < 0) {
            debtors.push({ user, amount: -balance })
        }
    }

    creditors.sort((a, b) => b.amount - a.amount)
    debtors.sort((a, b) => b.amount - a.amount)

    let i = 0, j = 0

    while (i < creditors.length && j < debtors.length) {
        const settlement = Math.min(creditors[i].amount, debtors[j].amount)
        settlements.push({ from: debtors[j].user, to: creditors[i].user, amount: settlement });
        creditors[i].amount -= settlement
        debtors[j].amount -= settlement
        if (creditors[i].amount === 0) i++
        if (debtors[j].amount === 0) j++
    }

    return settlements

}

async function getSettlements(req, res) {
    try {
        const { groupId } = req.params
        const expenses = await Expense.find({ group: groupId });

        let balances = {}

        for (const expense of expenses) {
            const paidBy = expense.paidBy.toString()
            balances[paidBy] = (balances[paidBy] || 0) + expense.amount

            for (const split of expense.splits) {
                const user = split.user.toString()

                balances[user] = (balances[user] || 0) - split.amount
            }
        }


        const settlementsRes = await Settlement.find({ group: groupId })
        for (const settlement of settlementsRes) {
            const from = settlement.from.toString()
            const to = settlement.to.toString()

            balances[from] = (balances[from] || 0) + settlement.amount
            balances[to] = (balances[to] || 0) - settlement.amount
        }

        const settlements = simplifyDebts(balances)

        res.json(settlements)

    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: "Something went wrong" })
    }
}

async function deleteExpense(req, res) {
    try {
        const { expenseId } = req.params

        const expenseRes = await Expense.findById(expenseId)
        if (!expenseRes) {
            return res.status(404).json({ error: "Expense doesn't exist" })
        }
        if (req.userId === expenseRes.paidBy.toString()) {
            await Expense.findByIdAndDelete(expenseId)

            res.status(200).json({ message: "Expense deleted successfully" })
        } else {
            return res.status(403).json({ error: "Only group creator can delete expenses" })
        }

    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: "Something went wrong" })
    }

}

function calculateSplits(splitType, amount, participants) {
    let splits = []
    if (splitType === "equal") {

        const splitAmt = amount / participants.length
        splits = participants.map((participantId) => {
            return { user: participantId, amount: splitAmt }
        })

    }
    else if (splitType === "exact") {
        let sum = 0

        for (const participant of participants) {
            sum += participant.amount
        }

        if (Math.abs(sum - amount) > 0.01) {
            throw new Error("Invalid amount")
        }

        splits = participants.map((p) => {
            return { user: p.userId, amount: p.amount }
        })

    }
    else if (splitType === "percentage") {
        let sum = 0

        for (const participant of participants) {
            sum += participant.percentage
        }

        if (Math.abs(sum - 100) > 0.01) {
            throw new Error("Percenatges don't add up to 100")
        }

        splits = participants.map((p) => {
            return { user: p.userId, amount: (p.percentage / 100) * amount }
        })

    }
    else {
        throw new Error("Invalid split type")
    }

    return splits
}

async function updateExpense(req, res) {
    try {
        const { expenseId } = req.params
        const { amount, description, splitType, participants, category } = req.body

        const expense = await Expense.findById(expenseId)

        if (!expense) {
            return res.status(404).json({ error: "Expense doesn't exist" })
        }
        if (req.userId !== expense.paidBy.toString()) {
            return res.status(403).json({ error: "Only the person who paid can edit the expense" })
        }

        let splits
        try {
            splits = calculateSplits(splitType, amount, participants)
        } catch (err) {
            return res.status(400).json({ error: err.message })
        }

        expense.amount = amount;
        expense.description = description
        expense.splitType = splitType
        expense.splits = splits
        expense.category = category

        await expense.save()
        res.status(200).json(expense)

    } catch (error) {

        console.error(error.message);
        res.status(500).json({ error: "Something went wrong" });

    }
}

async function getSpendingByCategory(req, res) {
    try {
        const { groupId } = req.params

        const expenses = await Expense.find({ group: groupId })

        let categoryTotals = {}

        for (const expense of expenses) {
            const category = expense.category
            categoryTotals[category] = (categoryTotals[category] || 0) + expense.amount
        }

        res.status(200).json(categoryTotals)

    } catch (error) {

        console.error(error.message);
        res.status(500).json({ error: "Something went wrong" });
    }

}

async function getSpendingByPerson(req , res){
    try {
        const { groupId } = req.params

        const expenses = await Expense.find({ group: groupId }).populate('paidBy' , 'name')

        let personTotals = {}

        for (const expense of expenses) {
            const userId = expense.paidBy._id.toString()
            const name = expense.paidBy.name
            if(!personTotals[userId]){
                personTotals[userId] = {name , total : 0}
            }

            personTotals[userId].total +=  expense.amount
        }

        res.status(200).json(personTotals)

    } catch (error) {

        console.error(error.message);
        res.status(500).json({ error: "Something went wrong" });
    }
}

module.exports = {
    addExpense, getExpenses, getBalances, getSettlements, deleteExpense,
    updateExpense , getSpendingByCategory , getSpendingByPerson
}