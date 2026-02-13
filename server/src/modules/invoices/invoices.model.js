import mongoose from "mongoose";

const DiscountSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["none", "percent", "flat"], default: "none" },
    percent: { type: Number, min: 0, max: 100, default: 0 },
    flatCents: { type: Number, min: 0, default: 0 },
  },
  { _id: false }
);

const RentalSchema = new mongoose.Schema(
  {
    unit: { type: String, enum: ["hour", "day"], default: "day" },
    duration: { type: Number, min: 1, default: 1 },

    rateCents: { type: Number, min: 0, default: 0 },
    flatRateCents: { type: Number, min: 0, default: 0 },
    depositCents: { type: Number, min: 0, default: 0 },

    startedAt: { type: Date },
    dueAt: { type: Date },
    returnedAt: { type: Date },
  },
  { _id: false }
);

const InvoiceLineSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    variantId: { type: String },

    name: { type: String, required: true },
    sku: { type: String },

    type: { type: String, enum: ["sale", "rental"], required: true },

    quantity: { type: Number, min: 1, default: 1 },

    unitPriceCents: { type: Number, min: 0, default: 0 },

    discount: { type: DiscountSchema, default: () => ({}) },

    overrideTotalCents: { type: Number, min: 0 },

    rental: { type: RentalSchema },

    lineSubtotalCents: { type: Number, min: 0, default: 0 },
    lineTaxCents: { type: Number, min: 0, default: 0 },
    lineTotalCents: { type: Number, min: 0, default: 0 },
  },
  { _id: false }
);

const InvoiceSchema = new mongoose.Schema(
  {
    invoiceNo: { type: String, required: true, unique: true, index: true },

    status: {
      type: String,
      enum: ["issued", "paid", "void"],
      default: "issued",
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userSnapshot: {
      name: { type: String },
      email: { type: String },
    },

    currency: { type: String, default: "AED" },

    taxRate: { type: Number, min: 0, max: 100, default: 0 },

    subtotalCents: { type: Number, min: 0, default: 0 },
    taxCents: { type: Number, min: 0, default: 0 },
    totalCents: { type: Number, min: 0, default: 0 },

    lines: { type: [InvoiceLineSchema], default: [] },

    notes: { type: String },

    meta: {
      transactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
      type: { type: String, enum: ["sale", "rental", "return"] },
    },

    pdf: {
      path: { type: String },
      generatedAt: { type: Date },
    },

    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

export const Invoice = mongoose.model("Invoice", InvoiceSchema);
