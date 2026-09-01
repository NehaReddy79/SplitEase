const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/authMiddleware')
const {createGroup , addMember , getMyGroups , getGroupMembers} = require('../controllers/groupController')
const verifyUser = require('../middleware/groupAuthMiddleware')

router.post('/' , verifyToken , createGroup)
router.post('/:groupId/members' , verifyToken , verifyUser, addMember)
router.get('/' , verifyToken , getMyGroups)
router.get('/:groupId/members', verifyToken, verifyUser, getGroupMembers)

module.exports = router;