// src/modules/proshop/routes/ProShopRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";

// PRODUCTS
import ProductListPage from "../products/ui/pages/ProductListPage.jsx";
import ProductCreatePage from "../products/ui/pages/ProductCreatePage.jsx";
import ProductEditPage from "../products/ui/pages/ProductEditPage.jsx";
import ProductDetailsPage from "../products/ui/pages/ProductDetailsPage.jsx";
import ProductDeletePage from "../products/ui/pages/ProductDeletePage.jsx";

// TRANSACTIONS
import SellRentPage from "../transactions/ui/pages/SellRentPage.jsx";
import SoldItemsPage from "../transactions/ui/pages/SoldItemsPage.jsx";
import RentedItemsPage from "../transactions/ui/pages/RentedItemsPage.jsx";
import ReturnedItemsPage from "../transactions/ui/pages/ReturnedItemsPage.jsx";
import ProductViewPage from "../products/ui/pages/ProductViewPage.jsx";

export default function ProShopRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="products" replace />} />

      <Route path="products" element={<ProductListPage />} />
      <Route path="products/new" element={<ProductCreatePage />} />
      <Route path="products/:id" element={<ProductDetailsPage />} />
      <Route path="products/:id/edit" element={<ProductEditPage />} />
      <Route path="products/:id/view" element={<ProductViewPage />} />
      <Route path="products/:id/delete" element={<ProductDeletePage />} />

      <Route path="transactions" element={<SellRentPage />} />
      <Route path="items/sold" element={<SoldItemsPage />} />
      <Route path="items/rented" element={<RentedItemsPage />} />
      <Route path="items/returned" element={<ReturnedItemsPage />} />
    </Routes>
  );
}
