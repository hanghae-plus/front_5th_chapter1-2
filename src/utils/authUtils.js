import { globalStore } from "../stores";

export const isAuthCheck = () => {
  const { loggedIn } = globalStore.getState();
  return loggedIn;
};
