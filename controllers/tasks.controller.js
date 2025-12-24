const tasksServices = require("../services/tasks.services")
const logger = require("../utils/logger")

const addTaskController = async(req, res, next) => {
    const userData = req.user || null
    const {title, description} = req.body || null

    if(!userData) return next({status: 401, message: "No autenticado"})

    if(title?.length > 30) return next({status: 400, message: "El título es demasiado largo"})

    if(description?.length > 150) return next({status: 400, message: "La descripción es demasiado larga"})

    try{
        const result = await tasksServices.addTaskService(userData, title, description)

        const newTask = {
            _id: result._id, 
            title: result.title, 
            description: result.description, 
            completed: result.completed, 
            createdAt: result.createdAt
        }

        logger.info("Task Created", {_id: result._id, userId: result.userId, createdAt: result.createdAt})

        return res.status(201).json({
            success: true,
            message: "Tarea añadida con éxito",
            data: newTask
        })
    } catch(error){
        next(error)
    }
}

const getAllTasksController = async(req, res, next) => {
    const userData = req.user || null
    const {page, limit, completed} = req.query || null

    if(!userData) return next({status: 401, message: "No autenticado"})
        
    try{
        const result = await tasksServices.getAllTasksService(userData, {page, limit, completed})

        return res.status(200).json({
            success: true,
            message: "Tareas recuperadas con éxito",
            data: result
        })
    } catch(error){
        next(error)
    }
}

const getTaskController = async(req, res, next) => {
    const {id} = req.params || null
    const userData = req.user || null

    if(!id) return next({status: 400, message: "Id inválido o inexistente"})
    if(!userData) return next({status: 401, message: "No autenticado"})

    try{
        const result = await tasksServices.getTaskService(userData, id)

        return res.status(200).json({
            success: true,
            message: "Tarea recuperada con éxito",
            data: result
        })
    } catch(error) {
        next(error)
    }
}

const updateTaskController = async(req, res, next) => {
    const {id} = req.params || null
    const {title, description, completed} = req.body || {}
    const userData = req.user || null

    if(!id) return next({status: 400, message: "Id inválido o inexistente"})

    if(!userData) return next({status: 401, message: "No autenticado"})

    if(title?.length > 30) return next({status: 400, message: "El título es demasiado largo"})

    if(description?.length > 150) return next({status: 400, message: "La descripción es demasiado larga"})

    try{
        const result = await tasksServices.updateTaskService(userData, id, title, description, completed)

        logger.info("Task Updated", {_id: result._id, userId: result.userId, createdAt: result.createdAt})

        return res.status(200).json({
            success: true,
            message: "Tarea actualizada con éxito",
            data: result
        })
    } catch(error){
        next(error)
    }
}

const deleteTaskController = async(req, res, next) => {
    const {id} = req.params || null
    const userData = req.user || null

    if(!id) return next({status: 400, message: "Id inválido o inexistente"})
    if(!userData) return next({status: 401, message: "No autenticado"})

    try{
        const result = await tasksServices.deleteTaskService(userData, id)

        logger.info("Task deleted", {_id: result._id, userId: result.userId, createdAt: result.createdAt})

        return res.sendStatus(204)
    } catch(error){
        next(error)
    }
}

module.exports = {addTaskController, getAllTasksController, getTaskController, updateTaskController, deleteTaskController}