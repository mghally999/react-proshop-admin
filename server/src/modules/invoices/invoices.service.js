import mongoose from "mongoose";
import { Invoice } from "./invoices.model.js";

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function toDto(doc) {
  const id = doc.id ?? doc._id;
  return { ...doc, id: String(id) };
}

export async function list({ page = 1, limit = 20 } = {}) {
  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(50, Math.max(1, Number(limit) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [rows, total] = await Promise.all([
    Invoice.find({}).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
    Invoice.countDocuments({}),
  ]);

  const pages = Math.max(1, Math.ceil(total / limitNum));
  return { items: rows.map((r) => toDto(r)), meta: { page: pageNum, limit: limitNum, total, pages } };
}

export async function getById(id) {
  if (!mongoose.isValidObjectId(id)) throw httpError(400, "Invalid invoice id");
  const doc = await Invoice.findById(id).lean();
  if (!doc) throw httpError(404, "Invoice not found");
  return toDto(doc);
}
