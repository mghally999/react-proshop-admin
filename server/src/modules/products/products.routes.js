// server/routes/products.routes.js
import express from "express";
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  importFakeStore,
} from "./products.controller";

const router = express.Router();

router.get("/", listProducts);
router.post("/import-fakestore", importFakeStore);
router.post("/", createProduct);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
