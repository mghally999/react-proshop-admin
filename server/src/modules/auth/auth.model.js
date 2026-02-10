import mongoose from "mongoose";

const AuthUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, default: "Admin" },
    role: { type: String, enum: ["admin"], default: "admin" },
    passwordHash: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const AuthUser =
  mongoose.models.AuthUser || mongoose.model("AuthUser", AuthUserSchema);
