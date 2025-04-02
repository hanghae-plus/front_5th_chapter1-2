import { FormHandler } from "./formHandler";
import { userStore } from "../../stores";
import { userStorage } from "../../storages";
import { User } from "../../types/user";
import { notification } from "../notification";
import { MESSAGES } from "../../consts/messages";

class ProfileFormHandlerClass extends FormHandler {
  private handleProfileSubmit = (e: SubmitEvent) => {
    const updatedProfile = this.getProfileData(e);
    this.updateProfile(updatedProfile);
  };

  private getProfileData(e: SubmitEvent) {
    const formData = new FormData(e.target as HTMLFormElement);
    return Object.fromEntries(formData);
  }

  private updateProfile(updatedProfile: Partial<User>) {
    const user = {
      ...userStore.getState().currentUser,
      ...updatedProfile,
    } as User;

    userStore.setState({ currentUser: user });
    userStorage.set(user);
    notification.success(MESSAGES.PROFILE_UPDATED);
  }

  handleSubmit = this.withPreventDefault(this.handleProfileSubmit);
}

export const profileFormHandler = () => new ProfileFormHandlerClass();
