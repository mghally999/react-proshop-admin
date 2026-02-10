import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema(
  {
    id: { type: String }, // optional UI id
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, trim: true },
    priceCents: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, trim: true, unique: true },
    category: { type: String, required: true, trim: true },

    productType: { type: String, enum: ["sale", "rental"], default: "sale" },
    status: {
      type: String,
      enum: ["draft", "active", "rented", "returned", "archived"],
      default: "draft",
    },
    isAvailable: { type: Boolean, default: true },

    priceCents: { type: Number, default: 0 },
    costCents: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },

    description: { type: String, default: "" },
    variants: { type: [VariantSchema], default: [] },

    // soft delete
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },

    // optional audit
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // external seeding (FakeStore)
    external: {
      provider: { type: String, default: null },
      externalId: { type: Number, default: null },
    },
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", sku: "text", category: "text" });

ProductSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Product = mongoose.model("Product", ProductSchema);
