import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    adminId: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: String, required: true },
    details: { type: Object, default: {} },
  },
  { timestamps: true }
);

export const AuditLog = mongoose.model("AuditLog", schema);
