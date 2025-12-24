const jwtUtils = require("../utils/jwt")

const authMiddleware = (req, res, next) => {
    const rawToken = req.headers.authorization || null

    try{
        const result = jwtUtils.verifyToken(rawToken)
        
        req.user = result
    } catch(error){
        next(error)
    }

    next()
}

module.exports = authMiddleware