const bcrypt = require("bcrypt")
const User = require("../models/user.model")

const jwtUtils = require("../utils/jwt")

const registerService = async (user, pass) => {
    const userInDb = await User.findOne({username: user}).select("username").select("username createdAt")

    if(userInDb) throw {status: 409, message: "El usuario ya existe"}

    const passwordHash = await bcrypt.hash(pass, 10)

    await User.create({
        username: user,
        password: passwordHash
    })

    return
}

const loginService = async(user, pass) => {
    const userInDb = await User.findOne({username: user}).select("-updatedAt")

    const match = await bcrypt.compare(pass, userInDb?.password ?? "")

    if(!userInDb || !match) throw {status: 400, message: "Usuario o contraseña incorrectos"}

    const payload = {id: userInDb._id, username: userInDb.username, role: userInDb.role}

    const token = jwtUtils.signToken(payload)
    const refreshToken = jwtUtils.refreshToken({id: payload.id})

    userInDb.refreshTokens.push({token: refreshToken})
    await userInDb.save()

    userInfo = {
        _id: userInDb._id,
        username: userInDb.username,
        createdAt: userInDb.createdAt
    }

    return {token, refreshToken, userInfo}
}

const refreshService = async(rawRefreshToken) => {
    const parsedRefreshToken = rawRefreshToken.split(";")[0].split("=")[1]

    const decodedPayload = jwtUtils.verifyRefreshToken(parsedRefreshToken)
    
    const newRefreshToken = jwtUtils.refreshToken({id: decodedPayload.id})
    
    const userInDb = await User.findOne({_id: decodedPayload.id, "refreshTokens.token": parsedRefreshToken}).select("-password")

    if(!userInDb) throw {status: 401, message: "Token de refresco inválido o inexistente"}

    const tokenDoc = userInDb.refreshTokens.find(item => item.token === parsedRefreshToken)

    if(!tokenDoc) throw {status: 401, message: "Token de refresco inválido o inexistente"}

    userInDb.refreshTokens.pull(tokenDoc._id)
    userInDb.refreshTokens.push({token: newRefreshToken})
    await userInDb.save()

    const payload = {id: userInDb._id, username: userInDb.username, role: userInDb.role}

    const newToken = jwtUtils.signToken(payload)

    return {newRefreshToken, newToken, userInDb}
}

const logoutService = async(rawRefreshToken) => {
    const parsedRefreshToken = rawRefreshToken.split(";")[0].split("=")[1]

    const decodedPayload = jwtUtils.verifyRefreshToken(parsedRefreshToken)

    const userInDb = await User.findOne({_id: decodedPayload.id}).select("-password")

    if(!userInDb) throw {status: 404, message: "Usuario no encontrado"}

    userInDb.refreshTokens.pull({token: parsedRefreshToken})
    await userInDb.save()

    return userInDb
}

module.exports = {registerService, loginService, refreshService, logoutService}