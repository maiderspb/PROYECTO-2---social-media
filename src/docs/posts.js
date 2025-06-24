module.exports = {
  paths: {
    "/posts": {
      get: {
        summary: "Obtener todas las publicaciones",
        tags: ["Posts"],
        responses: {
          200: {
            description: "Lista de publicaciones",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Post" },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Crear una nueva publicación",
        tags: ["Posts"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  content: { type: "string" },
                  image: { type: "string", nullable: true },
                  userId: { type: "string" },
                },
                required: ["title", "content", "userId"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Publicación creada exitosamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Post" },
              },
            },
          },
        },
      },
    },
    "/posts/{id}": {
      get: {
        summary: "Obtener una publicación por ID",
        tags: ["Posts"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Publicación encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Post" },
              },
            },
          },
          404: { description: "Publicación no encontrada" },
        },
      },
      put: {
        summary: "Actualizar una publicación",
        tags: ["Posts"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  content: { type: "string" },
                  image: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Publicación actualizada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Post" },
              },
            },
          },
          404: { description: "Publicación no encontrada" },
        },
      },
      delete: {
        summary: "Eliminar una publicación",
        tags: ["Posts"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          204: { description: "Publicación eliminada" },
          404: { description: "Publicación no encontrada" },
        },
      },
    },

    "/comments/{postId}": {
      post: {
        summary: "Agregar un comentario a un post",
        tags: ["Comments"],
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID del post al que se añade el comentario",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  text: { type: "string" },
                  image: { type: "string", format: "binary", nullable: true },
                  post: { type: "string" }, // o quitar si lo asignas desde postId
                },
                required: ["text"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Comentario creado exitosamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Comment" },
              },
            },
          },
          400: { description: "Error en datos de entrada" },
        },
      },
    },
    "/comments/{commentId}": {
      get: {
        summary: "Obtener un comentario por ID",
        tags: ["Comments"],
        parameters: [
          {
            name: "commentId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID del comentario",
          },
        ],
        responses: {
          200: {
            description: "Comentario encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Comment" },
              },
            },
          },
          404: { description: "Comentario no encontrado" },
        },
      },
    },
  },
};
