const BASE_PATH = import.meta.env.VITE_BASE_PATH || "/";

export const formatPath = (path) => {
  return path.replace(BASE_PATH, "/");
};
