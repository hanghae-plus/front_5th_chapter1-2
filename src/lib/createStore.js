import { createObserver } from "./createObserver.js";

export const createStore = (initialState, initialActions) => {
  const { subscribe, notify } = createObserver();

  let state = { ...initialState };

  const setState = (newState) => {
    state = { ...state, ...newState };
    notify();
  };

  const getState = () => ({ ...state });

  // TODO : 뭘까?
  const actions = Object.fromEntries(
    Object.entries(initialActions).map(([key, value]) => [
      key,
      (...args) => setState(value(getState(), ...args)),
    ]),
  );

  return { getState, setState, subscribe, actions };
};
