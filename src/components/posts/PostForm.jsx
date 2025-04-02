/** @jsx createVNode */
import { createVNode } from "../../lib";

import { globalStore } from "../../stores";

export const PostForm = () => {
  const { currentUser } = globalStore.getState();
  const { username } = currentUser;

  const handlePostFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const postContent = formData.get("post-content").trim();

    if (postContent === "") {
      alert("포스트를 작성 후 등록해주세요");
      return;
    }

    const newPostItem = {
      id: crypto.randomUUID(),
      author: username,
      time: Date.now(),
      content: postContent,
      likeUsers: [],
    };

    const { posts } = globalStore.getState();
    const newPosts = [...posts, newPostItem];

    globalStore.setState({
      posts: newPosts,
    });

    if (e.target["post-content"]) {
      e.target["post-content"].value = "";
    }
  };

  return (
    <form
      method="POST"
      className="mb-4 bg-white rounded-lg shadow p-4"
      onSubmit={handlePostFormSubmit}
    >
      <textarea
        id="post-content"
        name="post-content"
        placeholder="무슨 생각을 하고 계신가요?"
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        id="post-submit"
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
      >
        게시
      </button>
    </form>
  );
};
