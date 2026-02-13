// src/modules/proshop/reports/ui/pages/ReportsPage.jsx

import PageHeader from "@/app/layout/PageHeader.jsx";

import Skeleton from "@shared/ui/composites/Skeleton.jsx";
import EmptyState from "@shared/ui/composites/EmptyState.jsx";

import { useReports } from "@proshop/reports/domain/api/reports.queries.js";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import s from "../styles/reports.module.css";

export default function ReportsPage() {
  const { data, isLoading } = useReports();

  if (isLoading) {
    return <Skeleton rows={6} />;
  }

  if (!data) {
    return (
      <>
        <PageHeader title="Reports" />
        <EmptyState
          title="No reports yet"
          description="Reports will be generated once transactions occur."
        />
      </>
    );
  }

  const m = data.metrics || {};
  const revenueSeries = (data.series?.revenue || []).map((x) => ({
    day: x._id,
    revenue: Number(x.revenueCents || 0) / 100,
    count: Number(x.count || 0),
  }));
  const txSeries = (data.series?.transactions || []).map((x) => ({
    day: x._id,
    sold: x.sold || 0,
    rented: x.rented || 0,
    returned: x.returned || 0,
  }));
  const topCat = (data.breakdown?.topCategories || []).map((x) => ({
    name: x._id,
    count: x.count,
  }));

  return (
    <>
      <PageHeader title="Reports" />
      <div className={s.grid}>
        <div className={s.card}>
          <div className={s.cardTitle}>Revenue (last {data.windowDays}d)</div>
          <div className={s.cardValue}>AED {(Number(m.revenueCents || 0) / 100).toFixed(2)}</div>
          <div className={s.cardSub}>Invoices: {m.invoices || 0}</div>
        </div>
        <div className={s.card}>
          <div className={s.cardTitle}>Sales</div>
          <div className={s.cardValue}>{m.soldTx || 0}</div>
          <div className={s.cardSub}>Units sold transactions</div>
        </div>
        <div className={s.card}>
          <div className={s.cardTitle}>Rentals</div>
          <div className={s.cardValue}>{m.rentedTx || 0}</div>
          <div className={s.cardSub}>Active rentals</div>
        </div>
        <div className={s.card}>
          <div className={s.cardTitle}>Returned</div>
          <div className={s.cardValue}>{m.returnedTx || 0}</div>
          <div className={s.cardSub}>Completed returns</div>
        </div>
      </div>

      <div className={s.charts}>
        <div className={s.chartCard}>
          <div className={s.chartTitle}>Revenue by day</div>
          <div className={s.chartBody}>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={revenueSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={s.chartCard}>
          <div className={s.chartTitle}>Transactions by day</div>
          <div className={s.chartBody}>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={txSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sold" dot={false} />
                <Line type="monotone" dataKey="rented" dot={false} />
                <Line type="monotone" dataKey="returned" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={s.chartCard}>
          <div className={s.chartTitle}>Top categories</div>
          <div className={s.chartBody}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topCat}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
