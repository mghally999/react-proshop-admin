import { db } from "../db/store.js";

export const usersMock = {
  list() {
    return { items: db().users, total: db().users.length };
  },
};

export default usersMock;
