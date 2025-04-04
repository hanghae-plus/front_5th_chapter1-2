import { createObserver } from "./createObserver.js";

export const createStore = (initialState, initialActions, initialGetters) => {
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
      (...args) => {
        setState(value(getState(), ...args));
        return getState();
      },
    ]),
  );

  const getters = Object.fromEntries(
    Object.entries(initialGetters).map(([key, value]) => [
      key,
      (...args) => value(getState(), ...args),
    ]),
  );

  return { getState, setState, subscribe, actions, getters };
};
