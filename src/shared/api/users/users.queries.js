import { useQuery } from "@tanstack/react-query";
import usersMock from "@shared/api/mock/handlers/users.mock.js";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => usersMock.list(),
  });
}
