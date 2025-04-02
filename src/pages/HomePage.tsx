/** @jsx createVNode */
import { createVNode } from "../lib/vdom";

import { Footer, Header, Navigation, Post, PostForm } from "../components";
import { globalStore } from "../stores";

export const HomePage = () => {
  const { posts, loggedIn } = globalStore.getState();

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center">
      <div className="max-w-md w-full">
        <Header />
        <Navigation />

        <main className="p-4">
          {loggedIn ? <PostForm /> : null}
          <div id="posts-container" className="space-y-4">
            {[...posts]
              .sort((a, b) => b.time - a.time)
              .map((props) => {
                return <Post {...props} />;
              })}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};
