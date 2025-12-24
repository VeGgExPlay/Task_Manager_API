const authServices = require("../services/auth.services")
const logger = require("../utils/logger")

// Utilidad JWT
const jwtUtils = require("../utils/jwt")

const validateCredentials = (username, password) => {
    if(!username || typeof username !== "string" || !username.trim())
        throw{status: 400, message: "Nombre de usuario inválido o no proporcionado"}

    if(username.length > 15)
        throw {status: 400, message: "Nombre de usuario demasiado largo"}

    if(!password || typeof password !== "string" || !password.trim())
        throw{status: 400, message: "Contraseña inválida o no proporcionada"}
}

const registerController = async (req, res, next) => {
    const {username, password} = req.body || {}

    validateCredentials(username, password)

    try{
        const result = await authServices.registerService(username, password)

        logger.info("User Register", {_id: result.id, username: result.username, createdAt: result.createdAt})

        return res.status(201).json({
            success: true,
            message: "Usuario registrado con éxito"
        })
    } catch(error){
        next(error)
    }
}

const loginController = async(req, res, next) => {
    const {username, password} = req.body || {}

    validateCredentials(username, password)

    try{
        const result = await authServices.loginService(username, password)

        res.setHeader("Set-Cookie", `refreshToken=${result.refreshToken}; Path=/; Max-Age=2592000; HttpOnly; SameSite:Strict;`)

        logger.info("User login", {_id: result.userInfo._id, result: result.userInfo.username, createdAt: result.userInfo.createdAt})

        return res.status(200).json({
        success: true,
        message: "Login exitoso",
        data: result.token
    })
    } catch(error){
        next(error)
    }
}

const refreshController = async(req, res, next) => {
    const rawRefreshToken = req.headers.cookie || null

    if(!rawRefreshToken) return next({status: 401, message: "No autenticado"})

    try{
        const result = await authServices.refreshService(rawRefreshToken)

        res.setHeader("Set-Cookie", `refreshToken=${result.newRefreshToken}; Path=/; Max-Age=2592000; httpOnly; SameSite:Strict;`)

        logger.info("New Refresh Token Generated", {_id: result.userInDb._id, username: result.userInDb.username, createdAt: result.userInDb.createdAt})

        return res.status(200).json({
            success: true,
            message: "Nuevo token generado con éxito",
            data: result.newToken
        })
    } catch(error) {
        next(error)
    }
}

const logoutController = async(req, res, next) => {
    const rawRefreshToken = req.headers.cookie || ""

    // Eliminar la cookie del cliente
    res.setHeader("Set-Cookie", `refreshToken=; Path=/; Max-Age=0; httpOnly; SameSite:Strict;`)

    try{
        const result = await authServices.logoutService(rawRefreshToken)

        logger.info("User Logout", {_id: result._id, username: result.username})

        return res.sendStatus(200)
    } catch(error) {
        next(error)
    }
}

module.exports = {registerController, loginController, refreshController, logoutController}