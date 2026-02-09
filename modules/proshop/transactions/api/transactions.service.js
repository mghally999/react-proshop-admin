import { transactionsRepo } from "../../../../shared/api/repositories";

export const transactionsService = {
  list: (params) => transactionsRepo.list(params),
  create: (payload) => transactionsRepo.create(payload),
  update: (id, payload) => transactionsRepo.update(id, payload),
};
