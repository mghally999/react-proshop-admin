import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth.js";
import {
  listTransactions,
  createTransaction,
  getTransaction,
  markReturned,
} from "./transactions.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", listTransactions);
router.post("/", createTransaction);
router.get("/:id", getTransaction);
router.post("/:id/return", markReturned);

export default router;
