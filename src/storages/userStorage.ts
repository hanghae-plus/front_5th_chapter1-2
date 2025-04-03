import { createStorage } from "../lib/storage";
import { User } from "../types/user";

export const userStorage = createStorage<User>("user");
