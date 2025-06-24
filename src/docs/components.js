module.exports = {
  components: {
    securitySchemes: {
         bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          _id: { type: "string" },
          username: { type: "string" },
          email: { type: "string" },
        },
      },
      Comment: {
        type: "object",
        properties: {
          _id: { type: "string" },
          text: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          likes: {
            type: "array",
            items: { type: "string" },
          },
          replies: {
            type: "array",
            items: { $ref: "#/components/schemas/Comment" },
          },
          user: { $ref: "#/components/schemas/User" },
          post: { type: "string" },
        },
        required: ["text", "user", "post", "createdAt"],
      },
      Post: {
        type: "object",
        properties: {
          _id: { type: "string" },
          title: { type: "string" },
          content: { type: "string" },
          image: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          user: { $ref: "#/components/schemas/User" },
          likes: {
            type: "array",
            items: { type: "string" },
          },
          followers: {
            type: "array",
            items: { type: "string" },
          },
          comments: {
            type: "array",
            items: { $ref: "#/components/schemas/Comment" },
          },
        },
      },
    },
  },
};
