import express from "express";
import * as controller from "./products.controller.js";
import { requireAuth } from "../../middlewares/requireAuth.js";

const router = express.Router();

// LIST
router.get("/", controller.listProducts);

// GET ONE
router.get("/:id", controller.getProduct);

// CREATE
router.post("/", controller.createProduct);

// UPDATE
router.put("/:id", controller.updateProduct);

// DELETE (hard)
router.delete("/:id", controller.deleteProduct);

// IMPORT FAKESTORE
router.post("/import-fakestore", controller.importFakeStoreProducts);

export default router;
