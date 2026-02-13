import mongoose from "mongoose";

const RentalSchema = new mongoose.Schema(
  {
    unit: { type: String, enum: ["hour", "day"], default: "day" },
    duration: { type: Number, default: 1 },
    depositCents: { type: Number, default: 0 },
    startAt: { type: Date, default: null },
    endAt: { type: Date, default: null },
  },
  { _id: false }
);

const LineSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    variantId: { type: String, default: null },
    name: { type: String, required: true },
    sku: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    unitPriceCents: { type: Number, default: 0 },
    totalCents: { type: Number, default: 0 },
  },
  { _id: false }
);

const TransactionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["sale", "rental"], required: true },
    // matches UI expectations: sold | rented | returned
    status: { type: String, enum: ["sold", "rented", "returned"], required: true },

    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    lines: { type: [LineSchema], default: [] },

    // For rentals only
    rental: { type: RentalSchema, default: null },

    subtotalCents: { type: Number, default: 0 },
    taxCents: { type: Number, default: 0 },
    totalCents: { type: Number, default: 0 },

    notes: { type: String, default: "" },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "AuthUser", default: null },
  },
  { timestamps: true }
);

TransactionSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Transaction = mongoose.model("Transaction", TransactionSchema);
