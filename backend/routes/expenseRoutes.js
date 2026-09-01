const express = require('express')
const router = express.Router()
const {addExpense , getExpenses , getBalances, getSettlements, deleteExpense , updateExpense } = require('../controllers/expenseController')
const verifyToken = require('../middleware/authMiddleware')
const verifyUser = require('../middleware/groupAuthMiddleware')

router.post('/' , verifyToken , verifyUser ,  addExpense )
router.get('/:groupId' , verifyToken , verifyUser , getExpenses)
router.get('/:groupId/balances' , verifyToken , verifyUser, getBalances)
router.get('/:groupId/settlements' , verifyToken , verifyUser, getSettlements)
router.delete('/:expenseId' , verifyToken ,  deleteExpense)
router.put('/:expenseId' , verifyToken , updateExpense)

module.exports = router

