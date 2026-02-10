import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../layout/DashboardLayout.jsx";
import NotFound from "../error/NotFound.jsx";
import Forbidden from "../error/Forbidden.jsx";

// PRODUCTS
import ProductListPage from "@modules/proshop/products/ui/pages/ProductListPage.jsx";
import ProductCreatePage from "@modules/proshop/products/ui/pages/ProductCreatePage.jsx";
import ProductEditPage from "@modules/proshop/products/ui/pages/ProductEditPage.jsx";
import ProductDetailsPage from "@modules/proshop/products/ui/pages/ProductDetailsPage.jsx";

// TRANSACTIONS
import SellRentPage from "@modules/proshop/transactions/ui/pages/SellRentPage.jsx";
import SoldItemsPage from "@modules/proshop/transactions/ui/pages/SoldItemsPage.jsx";
import RentedItemsPage from "@modules/proshop/transactions/ui/pages/RentedItemsPage.jsx";
import ReturnedItemsPage from "@modules/proshop/transactions/ui/pages/ReturnedItemsPage.jsx";

// OTHER
import InvoiceDetailsPage from "@modules/proshop/invoices/ui/pages/InvoiceDetailsPage.jsx";
import ReportsPage from "@modules/proshop/reports/ui/pages/ReportsPage.jsx";
import AuditLogsPage from "@modules/proshop/audit/ui/pages/AuditLogsPage.jsx";
import LoginPage from "@modules/auth/ui/pages/LoginPage.jsx";
import RequireAuth from "./RequireAuth.jsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<LoginPage />} />

        <Route
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          {/* ROOT */}
          <Route
            path="/"
            element={<Navigate to="/proshop/products" replace />}
          />

          {/* PRODUCTS */}
          <Route path="/proshop/products" element={<ProductListPage />} />
          <Route path="/proshop/products/new" element={<ProductCreatePage />} />
          <Route
            path="/proshop/products/:id"
            element={<ProductDetailsPage />}
          />
          <Route
            path="/proshop/products/:id/edit"
            element={<ProductEditPage />}
          />

          {/* TRANSACTIONS */}
          <Route path="/proshop/transactions" element={<SellRentPage />} />
          <Route path="/proshop/items/sold" element={<SoldItemsPage />} />
          <Route path="/proshop/items/rented" element={<RentedItemsPage />} />
          <Route
            path="/proshop/items/returned"
            element={<ReturnedItemsPage />}
          />

          {/* OTHER */}
          <Route path="/proshop/invoices" element={<InvoiceDetailsPage />} />
          <Route path="/proshop/reports" element={<ReportsPage />} />
          <Route path="/proshop/audit" element={<AuditLogsPage />} />

          {/* ERRORS */}
          <Route path="/403" element={<Forbidden />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
