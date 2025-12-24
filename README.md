# Task Manager API

API REST para gestión de tareas con autenticación JWT y refresh tokens

## Tecnologías
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- BCrypt
- dotenv

## Instalación
```Bash
git clone git@github.com:VeGgExPlay/Task_Manager_API.git
cd task-manager-api
npm install
```

## Ejecutar el proyecto
```Bash
node server.js
```

## Variables de entorno
Crea un archivo .env en la raíz del proyecto con las siguientes variables:
```
    PORT                = 3000
    MONGO_URI           = mongodb://localhost:2701/db
    JWT_SECRET          = supersecret
    JWT_REFRESH_SECRET  = superrefreshsecret
```

## Autenticación
- La API utiliza JWT para la autenticación y el refresco del mismo token
- El token se envía en el header Authorization como se muestra en el siguiente ejemplo:\
        Authorization: Bearer \<token>
- El Refresh Token NO se envía en el header Authorization, se envía en la cookie httpOnly del cliente cuando se necesita refrescar la sesión del mismo, ejemplo de Refresh Token:\
        refreshToken=\<token>

## Endpoints
### Register:
- **Ruta:**
POST /auth/register
- **Descripción:**
Registra un usuario y devuelve una confirmación
- **Auth:**
No
- **Headers:**
"Content-Type": "application/json"
- **Body:**
```JSON
{
        "username": "usuario con longitud máxima de 15 caracteres",
        "password": "contraseña del usuario"
}
```
- **Respuesta:**
Status 201
```JSON
{
        "success": true,
        "message": "Usuario registrado con éxito",
}
```

### Login:
- **Ruta:**
POST /auth/login
- **Descripción:**
Inicia sesión y devuelve un token de autenticación JWT por el body y genera un Refresh Token que guarda en la base de datos y lo envía por la cookie del cliente
- **Auth:**
No
- **Headers:**
"Content-Type": "application/json"
- **Body:**
```JSON
{
    "username": "usuario registrado en la base de datos con longitud máxima de 15 caracteres",
    "password": "contraseña del usuario registrado en la base de datos"
}
```
- **Respuesta:**
Status 200
```JSON
{
    "success": true,
    "message": "Login exitoso",
    "data": authTokenJWT
}
```

### Logout:
- **Ruta:**
POST /auth/logout
- **Descripción:**
Cierra la sesión y elimina el token de refresco de la base de datos y de la cookie del cliente
- **Auth:**
No
- **Headers:**
No
- **Body:**
No
- **Respuesta:**
Status 200

### Refresh
- **Ruta:**
POST /auth/refresh
- **Descripción:**
Refresca el token JWT del cliente cuando su sesión ha caducado y envía un nuevo token de autenticación por el body, elimina el Refresh Token de la base de datos, almacena el nuevo Refresh Token en la base de datos y envía el nuevo Refresh Token por la cookie del cliente
- **Auth:**
No
- **Headers:**
"Cookie": "refreshToken=\<\token\>\"
- **Body:**
No
- **Respuesta:**
Status 200
```JSON
{
    "success": true,
    "message": "Nuevo token generado con éxito",
    "data": authTokenJWT
}
```

### Crear tarea
- **Ruta:**
POST /tasks
- **Descripción:**
Crea una nueva tarea en la base de datos
- **Auth:**
Sí
- **Headers:**
"Content-Type": "application/json", "Authorization": "Bearer <token>"
- **Body:**
```JSON
{
    "title": "título de la tarea con longitud máxima de 30 caracteres (OPCIONAL)",
    "description": "descripción de la tarea con longitud máxima de 150 caracteres (OPCIONAL)"
}
```
- **Respuesta:**
Status 201
```JSON
{
    "success": true,
    "message": "Tarea añadida con éxito",
    "data": {
        "_id": 1,
        "title": "Título de la tarea creada",
        "description": "Descripción de la tarea creada",
        "completed": "Valor booleano que indica si está completada o no la tarea",
        "userId": 1
    }
}
```

### Obtener todas las tareas
- **Ruta:**
GET /tasks?page=#&limit=#&completed=boolean
- **Descripción:**
Devuelve todas las tareas del usuario filtradas recibiendo parámetros mediante la query
- **Auth:**
Sí
- **Headers:**
"Authorization": "Bearer <token>"
- **Body:**
No
- **Respuesta:** 
Status 200
```JSON
{
    "success": true,
    "message": "Tareas recuperadas con éxito",
    "data": [
        {
            "_id": 1,
            "title": "Título de tarea",
            "description": "Descripción de tarea",
            "completed": "Valor booleano que indica si está completada o no la tarea",
            "createdAt": "Fecha de creación de la tarea"
        },
        ...
    ]
}
```

### Obtener una tarea
- **Ruta:**
GET /tasks/:id
- **Descripción:**
Devuelve una tarea específica del usuario en base al id proporcionado
- **Auth:**
Sí
- **Headers:**
"Authorization": "Bearer <token>"
- **Body:**
No
- **Respuesta:**
Status 200
```JSON
{
    "success": true,
    "message": "Tarea recuperada con éxito",
    "data": {
        "_id": 1,
        "title": "Título de tarea",
        "description": "Descripción de tarea",
        "completed": "Valor booleano que indica si está completada o no la tarea",
        "createdAt": "Fecha de creación de la tarea"
    }
}
```

### Actualizar una tarea
- **Ruta:**
PUT /tasks/:id
- **Descripción:**
Actualiza el "title", "description" o "completed" de una tarea ya creada en la base de datos
- **Auth:**
Sí
- **Headers:**
"Authorization": "Bearer <token>"
- **Body:**
JSON
```JSON
{
    "title": "Nuevo título de la tarea con longitud máxima de 30 caracteres (OPCIONAL)",
    "description": "Nueva descripción para la tarea con longitud máxima de 150 caracteres (OPCIONAL)",
    "completed": "Nuevo valor booleano para la tarea, donde true es \"Completada\" y false es \"Pendiente\" (OPCIONAL)"
}
```
- **Respuesta:**
Status 200
```JSON
{
    "success": true,
    "message": "Tarea creada con éxito",
    "data": {
        "_id": 1,
        "title": "Título de tarea actualizado",
        "description": "Descripción de tarea actualizada",
        "completed": "Valor booleano que indica si está completada o no la tarea",
        "createdAt": "Fecha de creación de la tarea"
    }
}
```

### Eliminar una tarea
- **Ruta:**
DELETE /tasks/:id
- **Descripción:**
Elimina una tarea en específico del usuario de la base de datos
- **Auth:**
Sí
- **Headers:**
"Authorization": "Bearer <token>"
- **Body:**
No
- **Respuesta:**
Status 200
```JSON
{
    "success": true,
    "message": "Tarea eliminada con éxito",
    "data": {
        "_id": 1,
        "title": "Título de tarea eliminada",
        "description": "Descripción de tarea eliminada",
        "createdAt": "Fecha de creación de la tarea"
    }
}
```

## Códigos de error comunes
    - 400: Petición inválida o error de validación
    - 401: No autenticado
    - 403: No autorizado
    - 404: Recurso no encontrado
    - 409: Recurso ya existente

