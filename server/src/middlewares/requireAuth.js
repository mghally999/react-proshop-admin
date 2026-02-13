export function requireAuth(req, res, next) {
  const u = req.session?.user;
  if (!u) return res.status(401).json({ message: "Unauthorized" });
  req.user = u;
  next();
}
