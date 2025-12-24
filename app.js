const express = require("express")

// Routers
const authRoutes = require("./routes/auth.routes")
const tasksRoutes = require("./routes/tasks.routes")

// Middlewares
const errorMiddleware = require("./middlewares/error.middleware")
const corsMiddleware = require("./middlewares/cors.middleware")

const app = express()

app.use(express.json())
app.use(corsMiddleware)

app.use("/auth", authRoutes)
app.use("/tasks", tasksRoutes)

// Middlewares de errores
app.use((req, res, next) => {
    next({status: 404, message: "Ruta no definida"})
})

app.use(errorMiddleware)

module.exports = app