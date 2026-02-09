import reportsMock from "@shared/api/mock/handlers/reports.mock.js";

export const reportsService = {
  overview(params) {
    return reportsMock.overview(params);
  },
};
