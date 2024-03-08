const errorHandler = (error, req, res, next) => {
  let status = error.status || 500;
  let message = error.message || "Something went wrong";
  if (error.name === "UnauthorizedError") {
    status = 401;
    message = "Unauthorized";
  }
  return res.status(status).json({
    status,
    message,
  });
};

const responseSuccess = (req, res, next) => {
  res.success = (data, status = 200, message = "Success") => {
    return res.status(status).json({
      status,
      message,
      data,
    });
  };
  return next();
};

module.exports = { errorHandler, responseSuccess };
