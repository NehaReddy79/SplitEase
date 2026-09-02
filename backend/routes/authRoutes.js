const express = require('express')
const router = express.Router()
const { signUp , login } = require('../controllers/authControllers')
const verifyToken = require('../middleware/authMiddleware')
const authLimiter = require('../middleware/rateLimiter')

router.post('/signup' ,authLimiter, signUp)
router.post('/login' ,authLimiter, login)

router.get('/test-protected', verifyToken, (req, res) => {
    res.json({ message: "You are authenticated", userId: req.userId });
});


module.exports = router