function errorHandler(err, req, res, next) {
  console.error('[GalaHunter Error]', err.message);

  if (err.response) {
    const status = err.response.status || 500;
    return res.status(status).json({
      error: 'API Error',
      detail: err.response.data?.message || err.response.data || err.message,
    });
  }

  res.status(500).json({
    error: 'Internal Server Error',
    detail: err.message,
  });
}

module.exports = errorHandler;
