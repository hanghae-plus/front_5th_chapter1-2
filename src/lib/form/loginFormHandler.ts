import { FormHandler } from "./formHandler";
import { userStore } from "../../stores";
import { userStorage } from "../../storages";
import { getValue } from "../dom";
import { ELEMENT_IDS } from "../../consts/elements";

class LoginFormHandlerClass extends FormHandler {
  private handleLoginSubmit = (e: Event) => {
    const username = getValue(ELEMENT_IDS.USERNAME);
    const user = { username, email: "", bio: "" };

    userStore.setState({
      currentUser: user,
      loggedIn: true,
    });
    userStorage.set(user);
  };

  handleSubmit = this.withPreventDefault(this.handleLoginSubmit);
}

export const loginFormHandler = () => new LoginFormHandlerClass();
