//auth.middleware.js
import { verifyToken } from "../../utils/jwt.js";

/**
 * Middleware para rutas protegidas.
 * Verifica la existencia y validez del token JWT.
 */
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const [scheme, token] = authHeader.split(" ");

  // validar formato "Bearer <token>"
  if (!/^Bearer$/i.test(scheme) || !token) {
    return res.status(401).json({ message: "Invalid authorization format" });
  }

  try  {

    const decoded = verifyToken(token);
    if (!decoded) {
    return res.status(401).json({ message: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }  
};



