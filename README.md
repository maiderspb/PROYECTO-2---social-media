# 📱 Red Social - Backend API

¡Bienvenido a la API de Social Media! 🚀 Aquí podrás gestionar usuarios, seguir a otros, publicar posts y mucho más.

# 🧩 Introducción

El presente proyecto de backend consiste en el desarrollo de una API REST para una red social, combinando los conocimientos adquiridos en Node.js, Express y MongoDB/Mongoose.

El objetivo es construir una API robusta, segura y desplegada en producción que permita registrar usuarios, gestionar publicaciones, comentarios, likes, autenticación, y otras funcionalidades sociales.

# 📝 Descripción del Proyecto

La API es capaz de:

- Registrar y autenticar usuarios con bcrypt y JWT.

- Crear, leer, actualizar y eliminar publicaciones (CRUD).

- Comentar publicaciones.

- Dar y quitar likes a posts y comentarios.

- Seguir y dejar de seguir a otros usuarios.

- Validar entradas del usuario y mostrar mensajes claros en caso de errores.

- Comprobar la autoría de posts y comentarios antes de modificarlos/eliminarlos.

- Adjuntar imágenes con Multer.

- Confirmar el registro de usuarios vía correo electrónico.

- Paginación y búsqueda avanzada.

# 🛠️ Tecnologías usadas

Node.js 🟢

Express.js ⚡

MongoDB 🍃

Mongoose 📦

JWT 🔐

Nodemon 🔄

Multer 📁

# 📁 Estructura del Proyecto

📦backend-red-social

┣ 📂controllers

┣ 📂middlewares

┣ 📂models

┣ 📂routes

┣ 📜index.js

┗ 📜README.md

# 🔐 Autenticación

- Registro con hash de contraseña usando bcrypt.

- Login con validación y generación de JWT.

- Logout.

- Verificación de cuenta vía correo electrónico.

- Middleware de autorización por roles y autoría.

# 📌 Endpoints Principales

## 🧑 Usuarios

- POST /api/users/register Registrar nuevo usuario
- POST /api/users/login Login y obtención de token
- GET /api/users/me Obtener datos del usuario autenticado
- GET /api/users/:id Buscar usuario por ID
- GET /api/users/search/:name Buscar usuario por nombre
- POST /api/users/follow/:id Seguir usuario
- POST /api/users/unfollow/:id Dejar de seguir usuario

## 📝 Posts

- POST /api/posts Crear post (autenticado)
- GET /api/posts Listar posts con usuarios y comentarios
- GET /api/posts/:id Obtener post por ID
- GET /api/posts/search/:name Buscar post por nombre
- PUT /api/posts/:id Actualizar post (autenticado)
- DELETE /api/posts/:id Eliminar post (autenticado)
- POST /api/posts/:id/like Dar like a post
- POST /api/posts/:id/unlike Quitar like a post

## 💬 Comentarios

- POST /api/comments/:postId Crear comentario en un post
- PUT /api/comments/:id Editar comentario propio
- DELETE /api/comments/:id Eliminar comentario propio
- POST /api/comments/:id/like Dar like a comentario
- POST /api/comments/:id/unlike Quitar like a comentario

## 🧰 Funcionalidades Extra

- Middleware de autoría para posts y comentarios.

- Soporte para imágenes en usuarios, posts y comentarios (Multer).

- Seguidores y seguidos.

- Validación de formularios (registro, login, post).

- Paginación de posts (10 por página).

- Envío de correo de confirmación con Nodemailer.

- Bloqueo de login si no se ha confirmado el email.

## 🛠️ Requisitos del Proyecto

- Uso de ramas Git: main (versión final) y develop (en desarrollo).

- Código limpio con commits significativos.

- README completo y claro.

- Proyecto subido a GitHub público.

- API desplegada en producción (ej: Render, Railway, Vercel backend, etc.).

## 🚀 Cómo usar esta API

### 1. Clonar el repositorio

git clone https://github.com/tu-usuario/social-media-api.git
cd social-media-api

### 2. Instalar dependencias

npm install

### 3. Configura variables de entorno

Crea un archivo .env con las siguientes variables:

PORT=5000
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/nombreDB
JWT_SECRET=tu_secreto_jwt
EMAIL_USER=tu_email@example.com
EMAIL_PASS=tu_password_email

### 4. Ejecutar la aplicación

npm run dev
La API correrá en http://localhost:5000

# 📚 Documentación de Endpoints

## 🔐 Autenticación y Usuarios

### ✍️ Registro de usuario

POST /api/auth/register

Body (form-data): username, email, password, image

Respuesta:
201 Created
{ message: "Usuario creado. Revisa tu correo para confirmar la cuenta." }

### ✅ Confirmar cuenta

GET /api/auth/confirm/:token

Respuesta:
200 OK
{ message: "Cuenta confirmada correctamente" }

### 🔑 Login

POST /api/auth/login

Body (JSON): { email, password }

Respuesta:
200 OK
{ token, user }

### 👤 Perfil propio

GET /api/auth/me

Headers: Authorization: Bearer <token>

Respuesta: Datos de usuario con posts, seguidores y seguidos.

### 👀 Ver usuario por ID

GET /api/auth/:id

Headers: Authorization: Bearer <token>

Respuesta: Datos públicos del usuario.

### ➕ Seguir usuario

POST /api/auth/:id/follow

Headers: Authorization: Bearer <token>

Respuesta: Mensaje confirmando seguimiento.

### ➖ Dejar de seguir usuario

POST /api/auth/:id/unfollow

Headers: Authorization: Bearer <token>

Respuesta: Mensaje confirmando que dejó de seguir.

### ✏️ Actualizar usuario

PUT /api/auth/:id

Headers: Authorization: Bearer <token>

Body (form-data): campos a actualizar (username, email, etc.)

Respuesta: Usuario actualizado.

## 📝 Posts

### ✏️ Actualizar post

PUT /api/posts/:id

Headers: Authorization: Bearer <token>

Body (JSON): Campos a actualizar

Respuesta: Post actualizado.

### 🗑️ Eliminar post

DELETE /api/posts/:id

Headers: Authorization: Bearer <token>

Respuesta: Post eliminado correctamente.

## 🌐 Despliegue

La API está disponible en producción en el siguiente enlace:

🔗 https://proyecto-2-social-media-9.onrender.com/api/posts
