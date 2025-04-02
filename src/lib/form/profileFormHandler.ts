import { FormHandler, withPreventDefault } from "./formHandler";
import { userStore } from "../../stores";
import { userStorage } from "../../storages";
import { User } from "../../types/user";

const handleProfileSubmit = (e: Event) => {
  const formData = new FormData(e.target as HTMLFormElement);
  const updatedProfile = Object.fromEntries(formData);
  const user = {
    ...userStore.getState().currentUser,
    ...updatedProfile,
  } as User;

  userStore.setState({ currentUser: user });
  userStorage.set(user);
  alert("프로필이 업데이트되었습니다.");
};

export const profileFormHandler = (): FormHandler => ({
  handleSubmit: withPreventDefault(handleProfileSubmit),
});
