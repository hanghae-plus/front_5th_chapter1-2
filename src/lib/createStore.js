import { createObserver } from "./createObserver.js";

export const createStore = (initialState, initialActions, initialSelectors) => {
  const { subscribe, notify } = createObserver();

  let state = { ...initialState };

  const setState = (newState) => {
    state = { ...state, ...newState };
    notify();
  };

  const getState = () => ({ ...state });

  const actions = Object.fromEntries(
    Object.entries(initialActions).map(([key, value]) => [
      key,
      (...args) => setState(value(getState(), ...args)),
    ]),
  );

  const selectors = Object.fromEntries(
    Object.entries(initialSelectors).map(([key, value]) => [
      key,
      (...args) => value(getState(), ...args),
    ]),
  );

  return { getState, setState, subscribe, actions, selectors };
};
