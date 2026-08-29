const express = require('express')
const router = express.Router()
const {addExpense , getExpenses , getBalances} = require('../controllers/expenseController')
const verifyToken = require('../middleware/authMiddleware')

router.post('/' , verifyToken , addExpense )
router.get('/:groupId' , verifyToken , getExpenses)
router.get('/:groupId/balances' , verifyToken , getBalances)

module.exports = router

