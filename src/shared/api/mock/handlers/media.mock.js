import { db } from "../db/store.js";

const usersMock = {
  list() {
    const state = db();
    return { items: [...state.users], total: state.users.length };
  },
};

export default usersMock;
