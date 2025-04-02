import { createStorage } from "../lib/storage";

export type User = {
  username: string;
  email: string;
  bio: string;
};

export const userStorage = createStorage<User>("user");
