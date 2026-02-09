import { Routes, Route, Navigate } from "react-router-dom";
import { routesConfig } from "/app/router/routes.config.jsx";

// PRODUCTS
import ProductListPage from "../products/ui/pages/ProductListPage.jsx";
import ProductCreatePage from "../products/ui/pages/ProductCreatePage.jsx";
import ProductEditPage from "../products/ui/pages/ProductEditPage.jsx";
import ProductViewPage from "../products/ui/pages/ProductViewPage.jsx";
import ProductDetailsPage from "../products/ui/pages/ProductDetailsPage.jsx";

// TRANSACTIONS
import SellRentPage from "../transactions/ui/pages/SellRentPage.jsx";
import SoldItemsPage from "../transactions/ui/pages/SoldItemsPage.jsx";
import RentedItemsPage from "../transactions/ui/pages/RentedItemsPage.jsx";
import ReturnedItemsPage from "../transactions/ui/pages/ReturnedItemsPage.jsx";

// OTHER
import InvoiceDetailsPage from "../invoices/ui/pages/InvoiceDetailsPage.jsx";
import ReportsPage from "../reports/ui/pages/ReportsPage.jsx";
import AuditLogsPage from "../audit/ui/pages/AuditLogsPage.jsx";

export default function ProShopRoutes() {
  return (
    <Routes>
      {/* Redirect /proshop -> /proshop/products */}
      <Route index element={<Navigate to={Routes.products} replace />} />

      {/* PRODUCTS */}
      <Route path="products" element={<ProductListPage />} />
      <Route path="products/new" element={<ProductCreatePage />} />
      <Route path="products/:id" element={<ProductDetailsPage />} />
      <Route path="products/:id/edit" element={<ProductEditPage />} />
      <Route path="products/:id/view" element={<ProductViewPage />} />

      {/* TRANSACTIONS */}
      <Route path="transactions" element={<SellRentPage />} />
      <Route path="items/sold" element={<SoldItemsPage />} />
      <Route path="items/rented" element={<RentedItemsPage />} />
      <Route path="items/returned" element={<ReturnedItemsPage />} />

      {/* OTHER */}
      <Route path="invoices" element={<InvoiceDetailsPage />} />
      <Route path="reports" element={<ReportsPage />} />
      <Route path="audit" element={<AuditLogsPage />} />
    </Routes>
  );
}
