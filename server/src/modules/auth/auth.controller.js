import { createAdminUser, loginWithEmailPassword } from "./auth.service.js";

export async function authLogin(req, res, next) {
  try {
    const { email, password } = req.body ?? {};
    const user = await loginWithEmailPassword({ email, password });

    req.session.user = user; // stored in Mongo via connect-mongo
    res.json({ user });
  } catch (e) {
    next(e);
  }
}

export async function authMe(req, res) {
  res.json({ user: req.session.user });
}

export async function authLogout(req, res, next) {
  try {
    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie("proshop.sid");
      res.json({ ok: true });
    });
  } catch (e) {
    next(e);
  }
}

// optional helper for creating more admins (dev)
export async function authCreateAdmin(req, res, next) {
  try {
    const { email, password, name } = req.body ?? {};
    const user = await createAdminUser({ email, password, name });
    res.status(201).json({ user });
  } catch (e) {
    next(e);
  }
}
