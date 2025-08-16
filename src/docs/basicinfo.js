module.exports = {
  openapi: "3.0.0",
  info: {
    title: "Red Social - API de Publicaciones",
    description:
      "API para gestionar publicaciones, comentarios y reacciones de usuarios.",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:5000/api",
      description: "Servidor local",
    },
    {
      url: "https://proyecto-2-social-media-9.onrender.com/api",
      description: "Servidor de producción",
    },
  ],
  
};

