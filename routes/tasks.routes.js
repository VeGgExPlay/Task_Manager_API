const express = require("express")
const router = express.Router()

const tasksController = require("../controllers/tasks.controller")

// Middlewares
const authMiddleware = require("../middlewares/auth.middleware")

router.post("/", authMiddleware, tasksController.addTaskController)
router.get("/", authMiddleware, tasksController.getAllTasksController)
router.get("/:id", authMiddleware, tasksController.getTaskController)
router.put("/:id", authMiddleware, tasksController.updateTaskController)
router.delete("/:id", authMiddleware, tasksController.deleteTaskController)

module.exports = router