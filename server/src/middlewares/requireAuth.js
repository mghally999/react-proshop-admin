export function requireAuth(req, res, next) {
  if (!req.session?.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.user = req.session.user; // { id, email, role, name }
  next();
}
