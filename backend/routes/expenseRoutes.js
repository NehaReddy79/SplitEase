const express = require('express')
const router = express.Router()
const {addExpense , getExpenses} = require('../controllers/expenseController')
const verifyToken = require('../middleware/authMiddleware')

router.post('/' , verifyToken , addExpense )
router.get('/:groupId' , verifyToken , getExpenses)

module.exports = router

