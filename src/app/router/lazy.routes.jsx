import { lazy } from "react";

export const ProShopRoutes = lazy(
  () => import("../../../modules/proshop/routes/ProShopRoutes.jsx")
);
