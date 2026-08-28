const jwt = require('jsonwebtoken')

async function verifyToken(req , res , next){

    try{
        const authHeader = req.headers.authorization;

        if(!authHeader){
            return res.status(401).json({error : "No token provided"})
        }
        const token = authHeader.split(" ")[1]

        try{
            const decoded = jwt.verify(token , process.env.JWT_SECRET)
            req.userId = decoded.id
            next()
        }catch(error){
            res.status(401).json({error : "Invalid token"})
        }
    }catch(error){
        console.error(error.message)
        res.status(500).json({error : "Something went wrong "})
    }
}

module.exports = verifyToken;