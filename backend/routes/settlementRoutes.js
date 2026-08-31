const {recordSettlement} = require('../controllers/settlementController')
const verifyToken = require('../middleware/authMiddleware')
const express = require('express')
const router = express.Router()

router.post('/' , verifyToken , recordSettlement)

module.exports = router