import { BASE_URL } from "../constants/baseURL";

export const createPath = (path) => {
  return `${BASE_URL}${path.slice(1)}`;
};
