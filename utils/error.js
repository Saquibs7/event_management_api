class AppError extends Error {
  constructor(message, statusCode=400) {
    super(message); this.statusCode = statusCode;
  }
}

function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
}

module.exports = { AppError, errorHandler };
