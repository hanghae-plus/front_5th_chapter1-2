import { VNode } from "./lib/vdom";

type Router = {
  path: string;
  push: (path: string) => void;
  subscribe: (callback: () => void) => () => void;
  getTarget: () => () => VNode;
};

export const router = {
  value: null as Router | null,
  get() {
    return this.value;
  },
  set(newValue: Router) {
    this.value = newValue;
  },
};
