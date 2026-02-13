import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth.js";
import { getNotifications, postMarkRead, postNotification } from "./notifications.controller.js";

const router = Router();
router.use(requireAuth);

router.get("/", getNotifications);
router.post("/", postNotification);
router.post("/:id/read", postMarkRead);

export default router;
