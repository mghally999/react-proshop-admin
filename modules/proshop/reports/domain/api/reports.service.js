import { reportsRepo } from "../../../../../shared/api/repositories/reports.repo";
import { normalizeReport } from "../../domain/reports.logic";

export const reportsService = {
  async list(params = {}) {
    const res = await reportsRepo.list(params);

    return {
      ...res,
      items: res.items.map(normalizeReport),
    };
  },
};
