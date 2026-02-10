import axios from "axios";

const base = "https://fakestoreapi.com";

export async function fetchFakeStoreProducts() {
  const res = await axios.get(`${base}/products`);
  return res.data;
}
