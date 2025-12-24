const express = require("express")
const router = express.Router()

// Controllers
const authController = require("../controllers/auth.controller")

router.post("/register", authController.registerController)
router.post("/login", authController.loginController)
router.post("/refresh", authController.refreshController)
router.post("/logout", authController.logoutController)

module.exports = router