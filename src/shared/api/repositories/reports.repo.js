import { db } from "../mock/db/store";
import { withLatency } from "../mock/utils/latency";

export const reportsRepo = {
  list: withLatency(() => {
    const { transactions } = db();

    const sales = transactions.filter((t) => t.type === "sale");
    const rentals = transactions.filter((t) => t.type === "rent");

    const totalSales = sales.reduce((sum, t) => sum + (t.price || 0), 0);
    const totalRentals = rentals.reduce((sum, t) => sum + (t.price || 0), 0);

    return {
      items: [
        {
          id: "sales",
          type: "Sales",
          period: "All time",
          total: totalSales,
          createdAt: Date.now(),
        },
        {
          id: "rentals",
          type: "Rentals",
          period: "All time",
          total: totalRentals,
          createdAt: Date.now(),
        },
      ],
      total: 2,
    };
  }),
};
