export const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

export const notFound = (req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
};