/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores";

export const PostForm = () => {
  const { posts } = globalStore.getState();
  const { currentUser } = globalStore.getState();

  const handleSubmit = () => {
    const textarea = document.getElementById("post-content");
    const newPost = {
      id: posts.length + 1,
      author: currentUser.username,
      time: Date.now(),
      content: textarea.value,
      likeUsers: [],
    };

    const newPosts = [newPost, ...posts];
    globalStore.setState({ posts: newPosts });
    textarea.value = "";
  };
  return (
    <div className="mb-4 bg-white rounded-lg shadow p-4">
      <textarea
        id="post-content"
        placeholder="무슨 생각을 하고 계신가요?"
        className="w-full p-2 border rounded"
      />
      <button
        id="post-submit"
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        게시
      </button>
    </div>
  );
};
