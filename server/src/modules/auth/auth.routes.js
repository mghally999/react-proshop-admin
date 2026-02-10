import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth.js";
import {
  authCreateAdmin,
  authLogin,
  authLogout,
  authMe,
} from "./auth.controller.js";

const router = Router();

router.post("/login", authLogin);
router.post("/logout", authLogout);
router.get("/me", requireAuth, authMe);

// DEV ONLY: create more admin users
router.post("/_dev/create-admin", authCreateAdmin);

export default router;
