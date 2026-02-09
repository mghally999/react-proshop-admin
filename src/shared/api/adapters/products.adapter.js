import { ENV } from "../../config/env.js";
import { mockListProducts } from "../mock/handlers/products.mock.js";

export async function listProductsAdapter(params) {
  if (ENV.USE_MOCK) {
    // simulate a tiny network delay (realistic UI)
    await new Promise((r) => setTimeout(r, 120));
    return mockListProducts(params);
  }

  // later: axios call
  // return httpClient.get(endpoints.products, { params })
  throw new Error("HTTP adapter not implemented yet");
}
