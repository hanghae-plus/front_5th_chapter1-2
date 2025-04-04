import { createStorage } from "../lib";

export const userStorage = createStorage("user");
console.log("🧾 현재 userStorage.get():", userStorage.get());
