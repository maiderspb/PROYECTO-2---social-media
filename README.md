#  📱 Red Social - Backend API

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

#  🧪 Tecnologías Utilizadas

- Node.js

- Express.js

- MongoDB + Mongoose

- Bcrypt

- JWT (JSON Web Token)

- Multer

- Nodemailer

- dotenv

- Git + GitHub

#  📁 Estructura del Proyecto

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

- POST	/api/users/register	Registrar nuevo usuario
- POST	/api/users/login	Login y obtención de token
- GET	/api/users/me	Obtener datos del usuario autenticado
- GET	/api/users/:id	Buscar usuario por ID
- GET	/api/users/search/:name	Buscar usuario por nombre
- POST	/api/users/follow/:id	Seguir usuario
- POST	/api/users/unfollow/:id	Dejar de seguir usuario

## 📝 Posts

- POST	/api/posts	Crear post (autenticado)
- GET	/api/posts	Listar posts con usuarios y comentarios
- GET	/api/posts/:id	Obtener post por ID
- GET	/api/posts/search/:name	Buscar post por nombre
- PUT	/api/posts/:id	Actualizar post (autenticado)
- DELETE	/api/posts/:id	Eliminar post (autenticado)
- POST	/api/posts/:id/like	Dar like a post
- POST	/api/posts/:id/unlike	Quitar like a post

## 💬 Comentarios

- POST	/api/comments/:postId	Crear comentario en un post
- PUT	/api/comments/:id	Editar comentario propio
- DELETE	/api/comments/:id	Eliminar comentario propio
- POST	/api/comments/:id/like	Dar like a comentario
- POST	/api/comments/:id/unlike	Quitar like a comentario

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

## 📦 Instalación

git clone https://github.com/maiderspb/PROYECTO-2---social-media.git

## Configurar variables de entorno
npm run dev

## 🌐 Despliegue

La API está disponible en producción en el siguiente enlace:

🔗 https://.com

## 📄 Documentación de la API
La documentación completa de la API se encuentra disponible en:

🔗 https://.com


