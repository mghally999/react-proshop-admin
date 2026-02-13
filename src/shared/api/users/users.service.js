import { httpClient } from "@shared/api/http/httpClient.js";

const usersService = {
  list(params) {
    return httpClient.get("/api/users", { params }).then((r) => r.data);
  },

  getById(id) {
    return httpClient.get(`/api/users/${id}`).then((r) => r.data);
  },

  // ✅ FIX: backend route is import-fakestore (NOT import/fakestore)
  importFakeStoreUsers() {
    return httpClient.post("/api/users/import-fakestore").then((r) => r.data);
  },

  // ✅ new: create user
  create(payload) {
    return httpClient.post("/api/users", payload).then((r) => r.data);
  },
};

export default usersService;
