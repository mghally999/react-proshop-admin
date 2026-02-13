import { Product } from "../products/products.model.js";
import { Transaction } from "../transactions/transactions.model.js";
import { Invoice }  from "../invoices/invoices.model.js";

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export async function overviewReport(req, res, next) {
  try {
    const days = Math.min(30, Math.max(7, Number(req.query.days || 7)));
    const to = new Date();
    const from = startOfDay(new Date(Date.now() - days * 24 * 60 * 60 * 1000));

    const [
      productsTotal,
      invoicesTotal,
      txAgg,
      revenueByDay,
      txByStatus,
      topCategories,
      lowStock,
    ] = await Promise.all([
      Product.countDocuments({ isDeleted: false }),
      Invoice.countDocuments({}),
      Transaction.aggregate([
        { $match: { createdAt: { $gte: from, $lte: to } } },
        {
          $group: {
            _id: null,
            salesCount: {
              $sum: { $cond: [{ $eq: ["$type", "sale"] }, 1, 0] },
            },
            rentalsCount: {
              $sum: { $cond: [{ $eq: ["$type", "rental"] }, 1, 0] },
            },
            returnsCount: {
              $sum: { $cond: [{ $eq: ["$status", "returned"] }, 1, 0] },
            },
            revenueCents: { $sum: "$totalCents" },
          },
        },
      ]),
      Transaction.aggregate([
        { $match: { createdAt: { $gte: from, $lte: to } } },
        {
          $group: {
            _id: {
              y: { $year: "$createdAt" },
              m: { $month: "$createdAt" },
              d: { $dayOfMonth: "$createdAt" },
            },
            revenueCents: { $sum: "$totalCents" },
          },
        },
        { $sort: { "_id.y": 1, "_id.m": 1, "_id.d": 1 } },
      ]),
      Transaction.aggregate([
        { $match: { createdAt: { $gte: from, $lte: to } } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Product.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
      Product.countDocuments({ isDeleted: false, stock: { $lte: 5 } }),
    ]);

    const tx = txAgg?.[0] || {
      salesCount: 0,
      rentalsCount: 0,
      returnsCount: 0,
      revenueCents: 0,
    };

    res.json({
      range: { from, to, days },
      summary: {
        productsTotal,
        invoicesTotal,
        lowStock,
        salesCount: tx.salesCount,
        rentalsCount: tx.rentalsCount,
        returnsCount: tx.returnsCount,
        revenueCents: tx.revenueCents,
      },
      series: {
        revenueByDay: revenueByDay.map((x) => ({
          date: `${x._id.y}-${String(x._id.m).padStart(2, "0")}-${String(x._id.d).padStart(2, "0")}`,
          revenueCents: x.revenueCents,
        })),
        txByStatus: txByStatus.map((x) => ({ status: x._id, count: x.count })),
        topCategories: topCategories.map((x) => ({ category: x._id || "Uncategorized", count: x.count })),
      },
    });
  } catch (e) {
    next(e);
  }
}
