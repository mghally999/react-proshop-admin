import usersMock from "@shared/api/mock/handlers/users.mock.js";

export const usersService = {
  list() {
    return usersMock.list();
  },
};
