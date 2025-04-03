import { createObserver } from "../observer";

export const createStore = <State extends object, Actions extends object>(
  initialState: State,
  initialActions: Actions,
) => {
  const { subscribe, notify } = createObserver();

  let state = { ...initialState };

  const setState = (newState: Partial<State>) => {
    state = { ...state, ...newState };
    notify();
  };

  const getState = () => ({ ...state });

  const actions = Object.fromEntries(
    Object.entries(initialActions).map(([key, value]) => [
      key,
      (...args: unknown[]) => setState(value(getState(), ...args)),
    ]),
  );

  return { getState, setState, subscribe, actions };
};
