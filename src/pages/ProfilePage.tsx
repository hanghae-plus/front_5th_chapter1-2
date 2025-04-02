/** @jsx createVNode */
import { createVNode } from "../lib/vdom";
import { Footer, Header, Navigation } from "../components";
import { userStore } from "../stores";
import { ProfileForm } from "../components/profile/ProfileForm";

export const ProfilePage = () => {
  const { loggedIn } = userStore.getState();

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center">
      <div className="max-w-md w-full">
        <Header />
        <Navigation loggedIn={loggedIn} />
        <main className="p-4">
          <ProfileForm />
        </main>
        <Footer />
      </div>
    </div>
  );
};
