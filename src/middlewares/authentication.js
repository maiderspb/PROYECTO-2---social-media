const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (process.env.NODE_ENV === "development") {
      console.log(`✅ Usuario autenticado: ${req.user.username} (${req.user.email})`);
    }

    next(); 
  } catch (err) {
    console.error("❌ Error en autenticación:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ type: "TOKEN_EXPIRED", message: "Token expirado" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ type: "TOKEN_INVALID", message: "Token inválido" });
    }

    return res.status(500).json({ message: "Error en la autenticación" });
  }
};