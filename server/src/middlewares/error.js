export function notFound(_req, res) {
  res.status(404).json({ message: "Not Found" });
}

export function errorHandler(err, _req, res, _next) {
  console.error(err);
  const status = Number(err?.statusCode ?? 500);
  res.status(status).json({
    message: err?.message ?? "Server error",
  });
}
