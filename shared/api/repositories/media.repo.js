import { withLatency } from "../mock/utils/latency";

export const mediaRepo = {
  upload: withLatency((file) => {
    return {
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      name: file.name,
    };
  }),
};
