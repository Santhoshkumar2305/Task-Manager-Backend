const jwt = require('jsonwebtoken')
const authMiddleware = (req,res,next) => {
    const token = req.header("Authorization")?.split(" ")[1]
    console.log(token)
    if(!token){
        return res.status(401).send({message: "Access denied token not provided"})
    }
    try{
        const decoded = jwt.verify(token,"secret_key")
        // console.log(decoded)
        req.user = decoded
        console.log("Token Verified ",decoded)
        next()
        
    }catch(error){
        return res.status(400).send({message: "invalid token"})
    }
}
module.exports = authMiddleware