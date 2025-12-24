const app = require("./app")
const connectDB = require("./db/db")

const dotenv = require("dotenv")

dotenv.config()

const PORT = process.env.PORT

// Conectar a la base de datos
connectDB()

// Levantar la API
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}`)
})