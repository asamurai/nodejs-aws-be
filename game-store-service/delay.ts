export const delay = async <T>(callback, ms) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(callback()), ms));
