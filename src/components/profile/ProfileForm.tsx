/** @jsx createVNode */
import { createVNode } from "../../lib/vdom";
import { userStore } from "../../stores";
import { FormField } from "./FormField";
import { profileFormHandler } from "../../lib/form";

export const ProfileForm = () => {
  const { currentUser } = userStore.getState();
  const { username = "", email = "", bio = "" } = currentUser ?? {};
  const { handleSubmit } = profileFormHandler();

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-8">
        내 프로필
      </h2>
      <form id="profile-form" onSubmit={handleSubmit}>
        <FormField label="사용자 이름" id="username" value={username} />
        <FormField label="이메일" id="email" type="email" value={email} />
        <FormField label="자기소개" id="bio" value={bio} rows={4} />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded font-bold"
        >
          프로필 업데이트
        </button>
      </form>
    </div>
  );
};
