import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth.js";
import {
  listUsers,
  getUserById,
  importFakeStoreUsers,
  createUser,
} from "./users.controller.js";

const router = Router();

router.use(requireAuth);

// list
router.get("/", listUsers);

// create
router.post("/", createUser);

// get one
router.get("/:id", getUserById);

// ✅ import (matches frontend fix)
router.post("/import-fakestore", importFakeStoreUsers);

export default router;
