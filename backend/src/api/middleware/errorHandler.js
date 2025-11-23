// src/api/middleware/errorHandler.js

export const errorHandler = (err, req, res, next) => {
  console.error("ERROR:", err);

  // Si el error trae código, úsalo (service lo define)
  const status = err.statusCode || 500;

  return res.status(status).json({
    error: err.name || "ServerError",
    message: err.message || "An unexpected error occurred."
  });
};
