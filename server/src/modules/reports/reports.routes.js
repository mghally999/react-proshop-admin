import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth.js";
import { overviewReport } from "./reports.controller.js";

const router = Router();
router.use(requireAuth);

router.get("/overview", overviewReport);

export default router;
