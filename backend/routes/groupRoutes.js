const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/authMiddleware')
const {createGroup , addMember} = require('../controllers/groupController')

router.post('/' , verifyToken , createGroup)
router.post('/:groupId/members' , verifyToken , addMember)

module.exports = router;