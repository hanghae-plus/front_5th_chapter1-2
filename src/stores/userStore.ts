import { createStore } from "../lib/store";
import { userStorage } from "../storages";
import { User } from "../types/user";

interface UserState {
  currentUser: User | null;
  loggedIn: boolean;
  error: string | null;
}

interface UserActions {
  login: (state: UserState, username: string) => UserState;
  logout: (state: UserState) => UserState;
  updateProfile: (state: UserState, user: User) => UserState;
  setError: (state: UserState, message: string) => UserState;
  clearError: (state: UserState) => UserState;
}

const initialState: UserState = {
  currentUser: userStorage.get(),
  loggedIn: Boolean(userStorage.get()),
  error: null,
};

const initialActions: UserActions = {
  login(state: UserState, username: string) {
    const user = { username, email: "", bio: "" };
    userStorage.set(user);
    return {
      ...state,
      currentUser: user,
      loggedIn: true,
      error: null,
    };
  },

  logout(state: UserState) {
    userStorage.reset();
    return {
      ...state,
      currentUser: null,
      loggedIn: false,
      error: null,
    };
  },

  updateProfile(state: UserState, user: User) {
    userStorage.set(user);
    return {
      ...state,
      currentUser: user,
      error: null,
    };
  },

  setError(state: UserState, message: string) {
    return {
      ...state,
      error: message,
    };
  },

  clearError(state: UserState) {
    return {
      ...state,
      error: null,
    };
  },
};

export const userStore = createStore(initialState, initialActions);
