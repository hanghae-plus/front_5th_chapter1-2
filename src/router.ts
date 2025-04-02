import { createRouter } from "./lib/router";
import { createHashRouter } from "./lib/router";

type Router = typeof createRouter | typeof createHashRouter;

export const router = {
  value: null as Router | null,
  get() {
    return this.value;
  },
  set(newValue: Router) {
    this.value = newValue;
  },
};
