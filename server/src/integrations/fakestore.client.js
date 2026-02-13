import axios from "axios";

const base = "https://fakestoreapi.com";

export async function fetchFakeStoreProducts() {
  const res = await axios.get(`${base}/products`);
  return res.data;
}

export async function fetchFakeStoreUsers() {
  const res = await axios.get(`${base}/users`);
  return res.data;
}

export async function fetchFakeStoreCarts() {
  const res = await axios.get(`${base}/carts`);
  return res.data;
}

export async function fetchFakeStoreCategories() {
  const res = await axios.get(`${base}/products/categories`);
  return res.data;
}
