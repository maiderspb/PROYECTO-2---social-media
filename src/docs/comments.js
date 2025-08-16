module.exports = {
  paths: {
    "/posts/{postId}/comments": {
      post: {
        tags: ["Comentarios"],
        summary: "Crear un comentario en un post",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  text: { type: "string" },
                  image: { type: "string", format: "binary" }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Comentario creado" },
          400: { description: "Datos inválidos" },
          401: { description: "No autorizado" }
        }
      }
    },

    "/posts/{postId}/comments/{commentId}": {
      put: {
        tags: ["Comentarios"],
        summary: "Actualizar comentario",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "postId", in: "path", required: true, schema: { type: "string" } },
          { name: "commentId", in: "path", required: true, schema: { type: "string" } }
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  text: { type: "string" },
                  image: { type: "string", format: "binary" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Comentario actualizado" },
          404: { description: "Comentario no encontrado" },
          401: { description: "No autorizado" }
        }
      },
      delete: {
        tags: ["Comentarios"],
        summary: "Eliminar comentario",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "postId", in: "path", required: true, schema: { type: "string" } },
          { name: "commentId", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          200: { description: "Comentario eliminado" },
          404: { description: "Comentario no encontrado" },
          401: { description: "No autorizado" }
        }
      }
    },

    "/posts/{postId}/comments/{commentId}/like": {
      post: {
        tags: ["Comentarios"],
        summary: "Dar like a un comentario",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "postId", in: "path", required: true, schema: { type: "string" } },
          { name: "commentId", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          200: { description: "Like agregado al comentario" },
          404: { description: "Comentario o post no encontrado" },
          401: { description: "No autorizado" }
        }
      },
      delete: {
        tags: ["Comentarios"],
        summary: "Quitar like de un comentario",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "postId", in: "path", required: true, schema: { type: "string" } },
          { name: "commentId", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          200: { description: "Like eliminado del comentario" },
          404: { description: "Comentario o post no encontrado" },
          401: { description: "No autorizado" }
        }
      }
    },

    "/comments/{commentId}": {
      get: {
        tags: ["Comentarios"],
        summary: "Obtener un comentario por ID",
        parameters: [
          {
            name: "commentId",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: { description: "Comentario encontrado" },
          404: { description: "Comentario no encontrado" }
        }
      }
    }
  }
};
