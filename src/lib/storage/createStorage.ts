export const createStorage = <T>(
  key: string,
  storage = window.localStorage,
) => {
  const get = () => JSON.parse(storage.getItem(key) ?? "null");
  const set = (value: T) => storage.setItem(key, JSON.stringify(value));
  const reset = () => storage.removeItem(key);

  return { get, set, reset };
};
