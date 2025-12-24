const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

const parseToken = (rawToken) => {
    if(!rawToken) throw{status: 401, message: "Token inválido o no proporcionado"}

    const [tokenType, token] = rawToken?.split(" ")

    if(tokenType !== "Bearer" || !token)
        throw{status: 401, message: "Token inválido o no proporcionado"}

    return token
}

const signToken = (payload, expires) => {
    const expireTime = typeof expires === "string" ? expires : "15m"

    if(!payload || typeof payload !== "object")
        throw {status: 400, message: "Payload inválido o no proporcionado"}

    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: expireTime})

    return token
}

const verifyToken = (rawToken) => {
    const parsedToken = parseToken(rawToken)

    try{
        const decodedPayload = jwt.verify(parsedToken, JWT_SECRET)

        return decodedPayload
    } catch(error){
        throw {status: 401, message: error.message, error}
    }
}

const verifyRefreshToken = (token) => {
    try{
        const decodedPayload = jwt.verify(token, JWT_REFRESH_SECRET)

        return decodedPayload
    } catch(error){
        throw error
    }
}

const refreshToken = (payload) => {
    if(!payload || typeof payload !== "object")
        throw {status: 400, message: "Payload inválido o no proporcionado"}

    try{
        const token = jwt.sign(payload, JWT_REFRESH_SECRET, {expiresIn: "30d"})

        return token
    } catch(error){
        throw error
    }
}

module.exports = {signToken, verifyToken, refreshToken, verifyRefreshToken}