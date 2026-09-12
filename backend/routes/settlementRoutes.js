const {recordSettlement , confirmSettlement} = require('../controllers/settlementController')
const verifyToken = require('../middleware/authMiddleware')
const verifyUser = require('../middleware/groupAuthMiddleware')
const express = require('express')
const router = express.Router()

router.post('/' , verifyToken , verifyUser, recordSettlement)
router.put('/:settlementId/confirm', verifyToken, confirmSettlement)

module.exports = router