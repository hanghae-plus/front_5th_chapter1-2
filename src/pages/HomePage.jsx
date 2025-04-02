/** @jsx createVNode */
import { createVNode } from "../lib";

import { Footer, Header, Navigation, Post, PostForm } from "../components";
import { globalStore } from "../stores";

/**
 * 심화과제
 * - 로그인한 사용자는 게시물을 추가할 수 있다.
 * - 로그인한 사용자는 게시물에 좋아요를 누를 수 있다.
 * - 로그인하지 않은 사용자가 게시물에 좋아요를 누를 경우, "로그인 후 이용해주세요"를 alert로 띄운다.
 */
export const HomePage = () => {
  const { posts, loggedIn, currentUser } = globalStore.getState();

  const handleLike = (id) => {
    const post = posts.find((post) => post.id === id);
    const likeUsers = post.likeUsers;
    const username = globalStore.getState().currentUser.username;

    // 이미 좋아요 한 경우
    if (likeUsers.includes(username)) {
      post.likeUsers = likeUsers.filter((user) => user !== username);
    } else {
      // 좋아요 안 한 경우
      post.likeUsers.push(username);
    }

    globalStore.setState({
      posts: posts.map((post) => (post.id === id ? post : post)),
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center">
      <div className="max-w-md w-full">
        <Header />
        <Navigation />

        <main className="p-4">
          {loggedIn && <PostForm />}
          <div id="posts-container" className="space-y-4">
            {[...posts]
              .sort((a, b) => b.time - a.time)
              .map((props) => {
                return (
                  <Post
                    {...props}
                    activationLike={props.likeUsers.includes(
                      currentUser?.username,
                    )}
                    loggedIn={loggedIn}
                    handleLike={handleLike}
                  />
                );
              })}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};
