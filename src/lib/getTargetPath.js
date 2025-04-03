const BASE_PATH = import.meta.env.VITE_BASE_PATH || "/";

export const getTargetPath = (path) => {
  const currentPath = `${BASE_PATH}${path}`;
  return currentPath.replace(/\/+/g, "/");
};
