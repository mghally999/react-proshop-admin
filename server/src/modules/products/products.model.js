import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema(
  {
    id: { type: String },
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

    productType: {
      type: String,
      enum: ["sale", "rental"],
      default: "sale",
    },

   status: {
  type: String,
  enum: ["draft", "active", "rented", "returned", "archived"],
  default: "draft",
},

    isAvailable: { type: Boolean, default: true },

    priceCents: { type: Number, default: 0 },
    costCents: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },

    rental: {
      unit: { type: String, enum: ["hour", "day"], default: "day" },
      rateCents: { type: Number, default: 0 },
      depositCents: { type: Number, default: 0 },
    },

    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },

    media: [
      {
        url: { type: String, required: true },
        primary: { type: Boolean, default: false },
        sortOrder: { type: Number, default: 0 },
      },
    ],

    variants: { type: [VariantSchema], default: [] },

    isDeleted: { type: Boolean, default: false },

    external: {
      provider: { type: String, default: null },
      externalId: { type: Number, default: null },
    },
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", sku: "text", category: "text" });

ProductSchema.set("toJSON", {
  transform: (_, ret) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Product = mongoose.model("Product", ProductSchema);
