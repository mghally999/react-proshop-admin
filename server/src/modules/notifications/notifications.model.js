import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    entityType: { type: String },
    entityId: { type: String },
    severity: { type: String, default: "info" }, // info | warning | critical
    isRead: { type: Boolean, default: false },
    recipients: { type: [String], default: [] }, // admin emails/ids
    meta: { type: Object, default: {} },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", schema);
