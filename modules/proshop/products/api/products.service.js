// src/modules/proshop/products/api/products.service.js
import axios from "axios";

const FAKE_STORE_API = "https://fakestoreapi.com";

const api = axios.create({
  baseURL: FAKE_STORE_API,
});

function normalizeListResponse(data, params) {
  if (Array.isArray(data)) {
    const page = Number(params?.page ?? 1);
    const pageSize = Number(params?.pageSize ?? 10);
    const total = data.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;

    // Apply search filter if provided
    let filtered = data;
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filtered = data.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower) ||
          item.category?.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter if provided (FakeStore doesn't have status, but we can simulate)
    if (params?.status && params.status !== "all") {
      // For FakeStore, we'll filter by category or rating
      if (params.status === "active") {
        filtered = filtered.filter((item) => item.rating?.rate >= 3);
      } else if (params.status === "inactive") {
        filtered = filtered.filter((item) => item.rating?.rate < 3);
      }
    }

    // Apply sorting if provided
    if (params?.sort) {
      const [field, direction] = params.sort.split(":");
      filtered.sort((a, b) => {
        let valA = a[field];
        let valB = b[field];

        // Handle nested fields
        if (field === "rating") {
          valA = a.rating?.rate;
          valB = b.rating?.rate;
        }

        if (valA < valB) return direction === "asc" ? -1 : 1;
        if (valA > valB) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    const newTotal = filtered.length;
    const newPages = Math.max(1, Math.ceil(newTotal / pageSize));
    const items = filtered.slice(start, start + pageSize);

    return {
      items,
      meta: {
        page,
        pageSize,
        total: newTotal,
        pages: newPages,
      },
    };
  }

  return { items: [], meta: { page: 1, pageSize: 10, total: 0, pages: 1 } };
}

export const productsService = {
  async list(params = {}) {
    try {
      const res = await api.get("/products");
      return normalizeListResponse(res.data, params);
    } catch (error) {
      console.error("Error fetching products:", error);
      return { items: [], meta: { page: 1, pageSize: 10, total: 0, pages: 1 } };
    }
  },

  async getById(id) {
    try {
      const res = await api.get(`/products/${id}`);
      console.log(`${res.data} response is working`);
      return res.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  async create(payload) {
    try {
      const res = await api.post("/products", payload);
      return res.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  async update(id, payload) {
    try {
      const res = await api.put(`/products/${id}`, payload);
      return res.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  async remove(id) {
    try {
      const res = await api.delete(`/products/${id}`);
      return res.data;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },

  async importFakeStore() {
    try {
      const res = await api.get("/products");
      const products = res.data;

      // Return fake import result (read-only API)
      return {
        imported: products.length,
        upserted: 0,
        message: `Fetched ${products.length} products from FakeStore API`,
      };
    } catch (error) {
      console.error("Error importing from FakeStore:", error);
      throw error;
    }
  },
};
