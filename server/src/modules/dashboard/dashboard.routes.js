import { Router } from "express";
import { requireAuth } from "../../middlewares/requireAuth.js";
import { Product } from "../products/products.model.js";
import { Transaction } from "../transactions/transactions.model.js";
import { Invoice }  from "../invoices/invoices.model.js";

const router = Router();
router.use(requireAuth);

router.get("/metrics", async (req, res, next) => {
  try {
    const [productCount, soldCount, rentedCount, returnedCount, invoiceCount, revenueAgg] = await Promise.all([
      Product.countDocuments({ isDeleted: false }),
      Transaction.countDocuments({ type: "sale", status: "sold" }),
      Transaction.countDocuments({ type: "rental", status: "rented" }),
      Transaction.countDocuments({ type: "rental", status: "returned" }),
      Invoice.countDocuments({}),
      Transaction.aggregate([
        { $match: { type: { $in: ["sale", "rental"] }, status: { $in: ["sold", "rented", "returned"] } } },
        { $group: { _id: null, total: { $sum: "$totalCents" } } },
      ]),
    ]);

    const totalRevenueCents = Number(revenueAgg?.[0]?.total || 0);

    res.json({
      productCount,
      soldCount,
      rentedCount,
      returnedCount,
      invoiceCount,
      totalRevenueCents,
    });
  } catch (e) {
    next(e);
  }
});

export default router;
