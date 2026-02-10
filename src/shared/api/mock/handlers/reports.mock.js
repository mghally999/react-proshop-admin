import { db } from "@shared/api/mock/db/store.js";
import { nowISO } from "@shared/lib/dates.js";

export const reportsMock = {
  overview() {
    const tx = db().transactions;

    const sold = tx.filter((t) => t.type === "sale" && t.status === "sold");
    const rented = tx.filter((t) => t.type === "rent" && t.status === "rented");
    const returned = tx.filter(
      (t) => t.type === "rent" && t.status === "returned"
    );

    const salesRevenue = sold.reduce((a, x) => a + (x.totalCents || 0), 0);
    const rentalRevenue = [...rented, ...returned].reduce(
      (a, x) => a + (x.totalCents || 0),
      0
    );

    const items = [
      {
        id: "r1",
        type: "Sales Revenue",
        period: "All time",
        total: salesRevenue,
        createdAt: nowISO(),
      },
      {
        id: "r2",
        type: "Rental Revenue",
        period: "All time",
        total: rentalRevenue,
        createdAt: nowISO(),
      },
      {
        id: "r3",
        type: "Active Rentals",
        period: "Now",
        total: rented.length,
        createdAt: nowISO(),
      },
      {
        id: "r4",
        type: "Returned Rentals",
        period: "All time",
        total: returned.length,
        createdAt: nowISO(),
      },
    ];

    return { items, total: items.length };
  },
};

export default reportsMock;
