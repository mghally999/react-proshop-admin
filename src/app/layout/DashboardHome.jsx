import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@shared/api/http/httpClient.js";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import s from "./DashboardHome.module.css";

export default function DashboardHome() {
  const metricsQuery = useQuery({
    queryKey: ["dashboard", "metrics"],
    queryFn: async () => {
      const res = await httpClient.get("/api/dashboard/metrics");
      return res.data;
    },
  });

  const reportQuery = useQuery({
    queryKey: ["reports", "overview", { days: 7 }],
    queryFn: async () => {
      const res = await httpClient.get("/api/reports/overview", { params: { days: 7 } });
      return res.data;
    },
  });

  const m = metricsQuery.data;
  const r = reportQuery.data;

  const revenueSeries = (r?.series?.revenueByDay || []).map((x) => ({
    day: x.date,
    revenue: Number(x.revenueCents || 0) / 100,
  }));

  return (
    <div className={s.wrap}>
      <div className={s.header}>
        <div>
          <h1 className={s.title}>Dashboard</h1>
          <div className={s.sub}>Live metrics from MongoDB + real API</div>
        </div>
      </div>

      <div className={s.grid}>
        <Stat title="Products" value={m?.productCount ?? "—"} />
        <Stat title="Sold" value={m?.soldCount ?? "—"} />
        <Stat title="Rented" value={m?.rentedCount ?? "—"} />
        <Stat title="Returned" value={m?.returnedCount ?? "—"} />
        <Stat title="Invoices" value={m?.invoiceCount ?? "—"} />
        <Stat
          title="Revenue"
          value={m?.totalRevenueCents != null ? `AED ${(m.totalRevenueCents / 100).toFixed(2)}` : "—"}
        />
      </div>

      <div className={s.charts}>
        <div className={s.chartCard}>
          <div className={s.chartTitle}>Revenue by day (last 7d)</div>
          <div className={s.chartBody}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className={s.chartFoot}>
            {reportQuery.isLoading
              ? "Loading…"
              : `Window: last ${r?.range?.days ?? 7} days`}
          </div>
        </div>

        <div className={s.chartCard}>
          <div className={s.chartTitle}>Realtime events</div>
          <div className={s.smallText}>
            When you Create/Edit/Delete products or Sell/Rent/Return, the backend emits Socket.IO events and the
            frontend auto-refreshes queries.
          </div>
          <div className={s.smallText}>
            Try: create a product → watch Products list + Dashboard update without manual refresh.
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className={s.card}>
      <div className={s.cardTitle}>{title}</div>
      <div className={s.cardValue}>{value}</div>
    </div>
  );
}
