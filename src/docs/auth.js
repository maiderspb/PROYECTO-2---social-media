module.exports = {
  paths: {
    "/auth/login": {
      post: {
        summary: "Login de usuario",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                    example: "usuario@correo.com",
                  },
                  password: {
                    type: "string",
                    example: "contraseñaSegura123",
                  },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login correcto",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: {
                      type: "string",
                      description: "JWT de autenticación",
                    },
                  },
                },
              },
            },
          },
          401: { description: "Credenciales inválidas" },
        },
      },
    },
  },
};
