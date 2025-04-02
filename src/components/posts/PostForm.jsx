/** @jsx createVNode */
import { createVNode } from "../../lib";
import { globalStore } from "../../stores";

export const PostForm = () => {
  const { addPost } = globalStore.actions;
  const { currentUser } = globalStore.getState();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const post = {
      id: 4,
      author: currentUser.username,
      time: Date.now(),
      content: document.getElementById("post-content").value,
      likeUsers: [],
    };

    addPost(post);
  };

  return (
    <div className="mb-4 bg-white rounded-lg shadow p-4">
      <form onSubmit={handleFormSubmit}>
        <textarea
          id="post-content"
          placeholder="무슨 생각을 하고 계신가요?"
          className="w-full p-2 border rounded"
        />
        <button
          id="post-submit"
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
        >
          게시
        </button>
      </form>
    </div>
  );
};
