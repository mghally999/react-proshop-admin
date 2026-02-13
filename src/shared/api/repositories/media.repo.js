export const mediaRepo = {
  async upload(file) {
    return {
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      name: file.name,
    };
  },
};
