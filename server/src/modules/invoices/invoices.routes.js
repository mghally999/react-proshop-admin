import { Router } from "express";
import * as controller from "./invoices.controller.js";

const router = Router();

router.get("/", controller.listInvoices);
router.get("/:id", controller.getInvoice);
router.get("/:id/pdf", controller.downloadInvoicePdf);

export default router;
