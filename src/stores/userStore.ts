import { createStore } from "../lib/store";
import { userStorage } from "../storages";
import { User } from "../types/user";

interface UserState {
  currentUser: User | null;
  loggedIn: boolean;
  error: null;
}

interface UserActions {
  login: (state: UserState, username: string) => UserState;
  logout: (state: UserState) => UserState;
  updateProfile: (state: UserState, user: User) => UserState;
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
    return { ...state, currentUser: user, loggedIn: true };
  },
  logout(state: UserState) {
    userStorage.reset();
    return { ...state, currentUser: null, loggedIn: false };
  },
  updateProfile(state: UserState, user: User) {
    userStorage.set(user);
    return { ...state, currentUser: user };
  },
};

export const userStore = createStore(initialState, initialActions);
