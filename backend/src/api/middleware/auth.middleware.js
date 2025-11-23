import { verifyToken } from "../../utils/jwt.js";
import { getUserById } from "../../db/models/user.model.js";

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const [scheme, token] = authHeader.split(" ");

  if (!/^Bearer$/i.test(scheme) || !token) {
    return res.status(401).json({ message: "Invalid authorization format" });
  }

  // 👉 Verificar token firmado
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  // 👉 Obtener usuario real desde la DB
  const user = await getUserById(decoded.id);
  if (!user) {
    return res.status(401).json({ message: "Invalid token user" });
  }

  // 🚨 ***VALIDACIÓN CRÍTICA***: token_version debe coincidir
  if (user.token_version !== decoded.token_version) {
    return res.status(401).json({
      message: "Token no longer valid (a newer login replaced this token)",
    });
  }

  // OK → Attach user
  req.user = user;
  next();
};
