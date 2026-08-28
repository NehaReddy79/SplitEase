const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

async function signUp(req, res) {

    try {
        const { name, email, password } = req.body;

        if (await User.findOne({ email })) {
            res.status(400).json({ error: "User already exists" });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({ name, email, password: hashedPassword });

            await newUser.save();
            res.status(201).json({ message: "User created successfully" })

        }
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ error: "Something went wrong" });
    }

}

async function login(req, res) {

    try {
        const { email, password } = req.body
        const userRes = await User.findOne({ email })
        if (userRes) {
            if (await bcrypt.compare(password, userRes.password)) {

                const token = jwt.sign(
                    { id: userRes._id },
                    process.env.JWT_SECRET,
                    { expiresIn: '7d' }
                )

                res.status(200).json({ token, userId: userRes._id })
            } else {
                res.status(400).json({ error: "Invalid credentials" })
            }
        } else {
            res.status(400).json({ error: "Invalid credentials" })
        }
    }catch(error){
        console.error(error.message)
        res.status(500).json({error : "Something went wrong"})
    }
    
}

module.exports = { signUp, login }