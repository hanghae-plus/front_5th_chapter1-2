/** @jsx createVNode */
import { createVNode } from "../lib";

import { Footer, Header, Navigation, Post, PostForm } from "../components";
import { globalStore } from "../stores";

export const HomePage = () => {
  const { currentUser, posts } = globalStore.getState();
  const { loggedIn } = globalStore.getState();

  const handlePostLike = (postId) => {
    if (!loggedIn) {
      alert("로그인 후 이용해주세요");

      return;
    }

    const targetPost = posts.find((post) => post.id === postId);
    const isAlreadyLiked = targetPost.likeUsers.includes(currentUser.username);

    if (isAlreadyLiked) {
      targetPost.likeUsers = targetPost.likeUsers.filter(
        (user) => user !== currentUser.username,
      );
    } else {
      targetPost.likeUsers.push(currentUser.username);
    }

    globalStore.setState({
      posts: posts.map((post) => (post.id === postId ? targetPost : post)),
    });
  };

  const renderPost = () => {
    const isLiked = (postId) => {
      if (!currentUser) return false;

      const targetPost = posts.find((post) => post.id === postId);

      return targetPost.likeUsers.includes(currentUser.username);
    };

    return (
      <div id="posts-container" className="space-y-4">
        {[...posts]
          .sort((a, b) => b.time - a.time)
          .map((props) => (
            <Post
              {...props}
              activationLike={isLiked(props.id)}
              onPostLike={() => handlePostLike(props.id)}
            />
          ))}
      </div>
    );
  };

  const handlePostSubmit = () => {
    const postContent = document.getElementById("post-content").value;

    globalStore.setState({
      posts: [
        ...posts,
        {
          id: posts.length + 1,
          author: currentUser.username,
          time: Date.now(),
          content: postContent,
          likeUsers: [],
        },
      ],
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center">
      <div className="max-w-md w-full">
        <Header />
        <Navigation />

        <main className="p-4">
          {loggedIn && <PostForm onPostSubmit={handlePostSubmit} />}
          {renderPost()}
        </main>

        <Footer />
      </div>
    </div>
  );
};
