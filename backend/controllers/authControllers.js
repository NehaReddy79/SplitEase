const User = require('../models/User')
const bcrypt = require('bcrypt')

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
    }catch(error){
        console.error(error.message)
        res.status(500).json({ error: "Something went wrong" });
    }
    
}
module.exports = signUp