import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth.js";
import { listAudit } from "./audit.controller.js";

const router = Router();
router.use(requireAuth);

router.get("/", listAudit);

export default router;
