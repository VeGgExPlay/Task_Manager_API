const Task = require("../models/task.model")

const addTaskService = async(userData, title, description) => {
    const task = await Task.create({
        title,
        description,
        userId: userData.id
    })

    return task
}

const getAllTasksService = async(userData, searchParams) => {
    let searchOptions = {}

    searchOptions.userId = userData.id
    if(searchParams?.completed) searchOptions.completed = searchParams.completed

    const tasks = await Task.find(searchOptions).select("title description completed createdAt").limit(10)

    if(!tasks || tasks?.length === 0) throw {status: 404, message: "No se encontraron tareas"}

    return tasks
}

const getTaskService = async(userData, id) => {
    const task = await Task.findOne({_id: id, userId: userData.id}).select("title description completed createdAt")

    if(!task) throw{status: 404, message: "Tarea no encontrada"}

    return task
}

const updateTaskService = async(userData, id, titleBody, descriptionBody, completedBody) => {
    let update = {}

    if(titleBody?.trim()) update.title = titleBody
    if(descriptionBody?.trim()) update.description = descriptionBody
    if(typeof completedBody === "boolean") update.completed = completedBody 

    const taskInDb = await Task.findOneAndUpdate({_id: id, userId: userData.id}, update)

    if(!taskInDb) throw {status: 404, message: "Tarea no encontrada"}

    const updatedTask = await Task.findOne({_id: id, userId: userData.id}).select("title description completed createdAt updatedAt")

    return updatedTask
}

const deleteTaskService = async(userData, id) => {
    const deletedTask = await Task.findOneAndDelete({_id: id, userId: userData.id}).select("title description completed createdAt")

    if(!deletedTask) throw {status: 404, message: "Tarea no encontrada"}

    return deletedTask
}

module.exports = {addTaskService, getAllTasksService, getTaskService, updateTaskService, deleteTaskService}