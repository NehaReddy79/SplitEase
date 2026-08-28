const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/authMiddleware')
const createGroup = require('../controllers/groupController')

router.post('/' , verifyToken , createGroup)

module.exports = router;