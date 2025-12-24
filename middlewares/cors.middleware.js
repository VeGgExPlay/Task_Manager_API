const corsMiddleware = (req, res, next) => {
    const allowedOrigins = ["http://localhost:5173"]
    const origin = req.headers.origin

    if(allowedOrigins.includes(origin)){
        res.setHeader("Access-Control-Allow-Origin", origin)
    }    

    res.setHeader("Access-Control-Allow-Credentials", "true")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")

    if(req.method === "OPTIONS"){
        return res.sendStatus(204)
    }

    next()
}

module.exports = corsMiddleware