const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/authMiddleware')
const {createGroup , addMember , getMyGroups , getGroupMembers} = require('../controllers/groupController')

router.post('/' , verifyToken , createGroup)
router.post('/:groupId/members' , verifyToken , addMember)
router.get('/' , verifyToken , getMyGroups)
router.get('/:groupId/members', verifyToken, getGroupMembers)

module.exports = router;